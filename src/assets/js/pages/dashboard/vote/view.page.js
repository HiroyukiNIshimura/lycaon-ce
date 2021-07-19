parasails.registerPage('vote-view', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    formatDate: $lycaon.formatter.formatDate,
    viewer: {},
    appendix: [],
    conflictUser: {},
    sneezeStates: [],
    commentEditor: {},
    sneezeEditor: {},
    openCommentIdentity: null,
    //…
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      /* … */
    },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
    },
    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.appendix = _.clone(this.vote.items);
  },
  mounted: async function () {
    var self = this;

    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    this.viewer = $lycaon.markdown.createViewer('#viewer', this.vote.body, '100%');

    this.commentEditor = $lycaon.markdown.createVoteSneezeEditor(
      '#comment-editor',
      '300px',
      'tab',
      i18next.t('Please enter a question or comment for the article'),
      ''
    );

    this.vote.sneezes.forEach((entity) => {
      var id = this.getCommentIdentity(entity);
      this.sneezeStates.push(false);
      $lycaon.markdown.createViewer('#' + id, entity.comment, '100%');
    });

    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
    if (this.errorMessage) {
      $lycaon.cloudErrorToast(this.errorMessage);
    }

    this.$nextTick(() => {
      this.renderCharts();
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    renderCharts: function () {
      var c1 = document.getElementById('vote-chart');
      if (c1) {
        var data = [];
        var labels = this.vote.choices.map((o) => {
          return o.choices;
        });
        labels.push(i18next.t('Unanswered'));

        if (this.vote.multipleAnswers) {
          var nons = _.filter(this.vote.users, (o) => {
            return o.answered === undefined || !o.answered;
          }).length;

          var total = this.vote.users.length;
          if (total > 0) {
            _.each(this.vote.choices, (o) => {
              data.push((_.filter(this.vote.answers, { voteChoices: o.id }).length / total) * 100);
            });
            data.push((nons / total) * 100);
          }

          new Chart(c1, {
            type: 'bar',
            data: {
              datasets: [
                {
                  data: data,
                },
              ],
              labels: labels,
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  suggestedMax: 100,
                  display: true,
                  title: {
                    display: true,
                    text: '%',
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                colorschemes: {
                  scheme: 'brewer.PastelOne9',
                },
              },
            },
          });
        } else {
          _.each(this.vote.choices, (o) => {
            data.push(_.filter(this.vote.answers, { voteChoices: o.id }).length);
          });
          data.push(
            _.filter(this.vote.users, (o) => {
              return o.answered === undefined || !o.answered;
            }).length
          );

          new Chart(c1, {
            type: 'pie',
            data: {
              datasets: [
                {
                  data: data,
                  fill: false,
                  borderWidth: 1,
                },
              ],
              labels: labels,
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
              legend: {
                position: 'left',
              },
              plugins: {
                colorschemes: {
                  scheme: 'brewer.PastelOne9',
                },
              },
            },
          });
        }
      }
    },

    fileLinksTarget: function (item) {
      if (item.mimeType.startsWith('application')) {
        return '';
      }
      return '_blank';
    },
    submitConfirm: function () {
      var form = _.find(this.$children, {
        $el: $('#confirm-circulation')[0],
      });
      form.submit();
    },
    submittedConfirmForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/vote/${response.id}`;
    },
    handleParsingConfirmForm: function () {
      return { id: this.vote.id };
    },
    submittedSneezeCreateForm: async function () {
      this.reload();
    },
    handleParsingSneezeCreateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        vote: this.vote.id,
        comment: $lycaon.markdown.getMarkdown(this.commentEditor),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      } else {
        if (new TextEncoder().encode(argins.comment).length >= 2000000) {
          this.formErrors.commentLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    submittedSneezeUpdateForm: async function () {
      this.reload();
    },
    handleParsingSneezeUpdateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.openCommentIdentity,
        comment: $lycaon.markdown.getMarkdown(this.sneezeEditor),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    getCommentEditorIdentityWrapper: function (sneeze) {
      return 'wrapper-comment-editor-' + String(sneeze.serialNumber);
    },
    getCommentEditorIdentity: function (sneeze) {
      return 'comment-editor-' + String(sneeze.serialNumber);
    },
    getCommentIdentity: function (sneeze) {
      return 'comment-' + String(sneeze.serialNumber);
    },
    getSneezeIdentity: function (sneeze) {
      return 'sneeze-' + String(sneeze.serialNumber);
    },
    showSneezeView: function (sneeze) {
      var index = _.findIndex(this.vote.sneezes, {
        id: sneeze.id,
      });
      return !this.sneezeStates[index];
    },
    showSneezeEditor: function (sneeze) {
      var index = _.findIndex(this.vote.sneezes, {
        id: sneeze.id,
      });
      return this.sneezeStates[index];
    },
    onCommentEditClick: function (sneeze) {
      if (!this.checkCommentEditing()) {
        return;
      }

      this.openCommentIdentity = sneeze.id;
      this.$set(
        this.sneezeStates,
        _.findIndex(this.vote.sneezes, {
          id: sneeze.id,
        }),
        true
      );

      var self = this;
      this.$nextTick(() => {
        $('#' + this.getSneezeIdentity(sneeze)).addClass('edit-active');

        self.sneezeEditor = $lycaon.markdown.createVoteSneezeEditor(
          '#' + this.getCommentEditorIdentity(sneeze),
          '300px',
          'tab',
          i18next.t('Please enter a question or comment for the article'),
          sneeze.comment
        );
        self.sneezeEditor.mdEditor.moveCursorToStart();
        $lycaon.jumpTo($('#' + self.getSneezeIdentity(sneeze)));
      });
    },
    onCommentEditCancelClick: function (sneeze) {
      this.openCommentIdentity = null;
      var editorWrapper = this.getSneezeIdentity(sneeze);

      this.$set(
        this.sneezeStates,
        _.findIndex(this.vote.sneezes, {
          id: sneeze.id,
        }),
        false
      );

      var self = this;
      this.$nextTick(() => {
        self.sneezeEditor.defaultUI.destroy();
        self.sneezeEditor = {};
        $('#' + editorWrapper).removeClass('edit-active');
      });
    },
    sneezeAnker: function (sneeze) {
      return `/${this.organization.handleId}/vote/${this.vote.id}#${this.getSneezeIdentity(sneeze)}`;
    },
    checkCommentEditing: function () {
      if (this.openCommentIdentity) {
        var sneeze = _.find(this.vote.sneezes, {
          id: this.openCommentIdentity,
        });
        $lycaon.jumpTo($('#' + this.getSneezeIdentity(sneeze)));
        $lycaon.infoToast('Editing comment [{0}] ...', [sneeze.serialNumber]);
        return false;
      }
      return true;
    },

    getAnswers: function (user) {
      var answers = [];
      _.each(user.answers, (o) => {
        let token = i18next.t(o.choices);
        if (o.isOther) {
          token = `${token}(${o.otherToken})`;
        }
        answers.push(token);
      });

      return answers.join(',');
    },
    downloadAppendix: function (item) {
      return `/download/vote/${this.vote.id}/${item.id}`;
    },
    reload: function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/vote/${this.vote.id}`;
    },
  },
  computed: {
    commentTranslator: function () {},
    beforeRelease: function () {
      return this.badState === 'notAnswerNotReleased';
    },
    allowConfirmed: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      if (!myUser) {
        return false;
      }
      if (this.badState === 'notAnswerNotReleased' || this.badState === 'notConfirmPassedDeadline') {
        return false;
      }
      return !this.vote.isQuestionnaireFormat && !myUser.answered;
    },
    confirmed: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      if (!myUser) {
        return false;
      }
      return !this.vote.isQuestionnaireFormat && myUser.answered;
    },
    answeredAt: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      if (!myUser) {
        return '';
      }
      return this.formatDate(myUser.answeredAt);
    },
    allowAnswere: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      if (!myUser) {
        return false;
      }
      if (this.badState === 'notAnswerNotReleased' || this.badState === 'notConfirmPassedDeadline') {
        return false;
      }
      return true;
    },
    notAnswered: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      return this.vote.isQuestionnaireFormat && !myUser.answered;
    },
    editLink: function () {
      return `/${this.organization.handleId}/vote/edit/${this.vote.id}`;
    },
    returnLink: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }
      return `/${this.organization.handleId}/main`;
    },
    answerLink: function () {
      return `/${this.organization.handleId}/vote/answer/${this.vote.id}`;
    },
    answerEditLink: function () {
      return `/${this.organization.handleId}/vote/answer/${this.vote.id}`;
    },
  },
});
