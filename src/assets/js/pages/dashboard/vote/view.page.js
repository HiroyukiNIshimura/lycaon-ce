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

    io.socket.on('message-notify', function (response) {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    this.viewer = $lycaon.markdown.createViewer('#viewer', this.vote.body, '100%');

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

        _.each(this.vote.choices, (o) => {
          data.push(_.filter(this.vote.answers, { voteChoices: o.id }).length);
        });

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
            labels: this.vote.choices.map((o) => {
              return o.choices;
            }),
          },
          options: {
            responsive: true,
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
    downloadAppendix: function (item, index) {
      return `/download/vote/${this.vote.id}/${item.id}`;
    },
  },
  computed: {
    beforeRelease: function () {
      return this.badState === 'notAnswerNotReleased';
    },
    allowConfirmed: function () {
      var myUser = _.find(this.vote.users, { id: this.me.id });
      if (!myUser) {
        return false;
      }
      if (
        this.badState === 'notAnswerNotReleased' ||
        this.badState === 'notConfirmPassedDeadline'
      ) {
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
      if (
        this.badState === 'notAnswerNotReleased' ||
        this.badState === 'notConfirmPassedDeadline'
      ) {
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
