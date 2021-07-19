parasails.registerPage('vote-edit', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    showForceModal: false,
    cloudUsers: [],
    userTagifySettings: {},
    selectedUsers: [],
    selectedTeam: 0,
    selectedDateRang: {},
    teams: [],
    appendix: [],
    voteEditor: {},
    cloudQuestions: [],
    questionTagifySettings: {},
    selectedQuestions: [],
    isUploading: false,
    viewerBlock: {},
    showImageListModal: false,
    isQuestionnaireFormat: false,

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
    //…
    this.userTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select users to join the circulation'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
    });

    var self = this;
    _.each(this.users, (entry) => {
      self.userTagifySettings.whitelist.push({
        value: entry.fullName,
        id: entry.id,
      });
    });

    _.each(this.vote.users, (entry) => {
      var val = {
        value: entry.fullName,
        id: entry.id,
      };
      self.cloudUsers.push(val);
    });

    this.questionTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Enter your question'),
      enforceWhitelist: false,
      maxTags: 50,
      dropdown: {
        maxItems: undefined,
      },
    });

    _.each(this.vote.choices, (entry) => {
      if (!entry.isOther && entry.choices !== 'Browsed') {
        self.questionTagifySettings.whitelist.push({
          value: entry.choices,
          id: entry.id,
        });

        var val = {
          value: entry.choices,
          id: entry.id,
        };
        self.cloudQuestions.push(val);
      }
    });

    this.formData = {
      subject: this.vote.subject,
      hasOther: this.vote.hasOther,
      multipleAnswers: this.vote.multipleAnswers,
      question: this.vote.question,
    };
    this.isQuestionnaireFormat = this.vote.isQuestionnaireFormat;

    this.appendix = _.clone(this.vote.items);

    if (this.vote.circulationFrom) {
      this.selectedDateRang.start = new Date(Number(this.vote.circulationFrom));
    }
    if (this.vote.circulationTo) {
      this.selectedDateRang.end = new Date(Number(this.vote.circulationTo));
    }
  },
  mounted: async function () {
    var self = this;
    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.data.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    this.selectedUsers = _.extend([], this.cloudUsers);
    if (this.vote.isQuestionnaireFormat) {
      this.selectedQuestions = _.extend([], this.cloudQuestions);
    }

    var mode = 'vertical';
    if (window.matchMedia('(max-width:480px)').matches) {
      mode = 'tab';
    }
    this.voteEditor = $lycaon.markdown.createEditor(
      '#vote-editor',
      '300px',
      mode,
      i18next.t('Feel free to enter ...'),
      this.vote.body,
      this.addImageBlobHook.bind(this)
    );
    $lycaon.markdown.addToolberImageList(this.voteEditor, () => {
      self.$refs.imagelist.load();
      self.showImageListModal = true;
    });

    $lycaon.invalidEnterKey();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    addOrganizationAll: function () {
      this.selectedUsers = _.extend([], this.cloudUsers);
    },
    addTeamAll: function () {
      if (!this.selectedTeam) {
        return;
      }

      // eslint-disable-next-line camelcase
      var users = _.filter(this.teamUsers, { team_users: this.selectedTeam });
      var targets = _.filter(this.cloudUsers, (o) => {
        // eslint-disable-next-line camelcase
        if (_.findIndex(users, { user_teams: o.id }) > -1) {
          return true;
        }
        return false;
      });
      this.selectedUsers = _.extend([], targets);
    },
    clearAll: function () {
      this.selectedUsers = [];
    },
    onChangeUserTags: function () {},
    onChangeQuestionTags: function () {},
    blockEditor: function (label) {
      this.viewerBlock = Vue.$loading.show(
        {
          container: this.$refs.voteEditor,
          canCancel: false,
          color: '#000000',
          loader: 'dots',
          width: 64,
          height: 64,
          backgroundColor: '#ffffff',
          opacity: 0.5,
          zIndex: 999,
          isFullPage: false,
        },
        {
          before: this.$createElement('div', { class: 'loading-before' }, [label]),
        }
      );
    },
    hideBlock: function () {
      if (this.viewerBlock) {
        this.viewerBlock.hide();
      }
    },
    addImageBlobHook: async function (blob, callback) {
      var data = new FormData();
      data.append('appendix', blob);

      this.isUploading = true;
      if (_.isFunction(callback)) {
        this.blockEditor(this.i18n('Uploading {0} ...').format(this.i18n('File')));
      }

      var self = this;
      try {
        var response = await $lycaon.axios.post(
          `/api/v1/appendix/vote/${this.vote.id}`,
          data,
          {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          },
          {
            'x-blobsize': blob.size,
          }
        );

        if (response.data.status === 'error') {
          if (response.data.error === 'maxQuota') {
            $lycaon.infoKeepToast(
              'The current plan does not allow the entire organization to attach any more files. A storage limit has occurred. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxSizePerVote') {
            $lycaon.infoKeepToast(
              'No more files can be attached to this circular notice with the current plan. You have reached the circular notice attachment size limit. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxFilePerVote') {
            $lycaon.infoKeepToast(
              'No more files can be attached to this circular notice with the current plan. You have reached the circular notice attachment limit. Please consider updating your usage plan'
            );
          } else {
            $lycaon.errorToast(
              'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
              [formatter.format(this.sysSettings.maxUploadFileSize)]
            );
          }

          if (_.isFunction(callback)) {
            return callback(i18next.t('Upload error'), blob.name);
          }
        } else {
          self.appendix.push(response.data.item);
          if (_.isFunction(callback)) {
            return callback(response.data.urlMid, response.data.item.name);
          }
        }
      } catch (error) {
        console.log(error);
        $lycaon.errorToast(
          'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
          [formatter.format(this.sysSettings.maxUploadFileSize)]
        );

        if (_.isFunction(callback)) {
          return callback(i18next.t('Upload error'), blob.name);
        }
      } finally {
        self.isUploading = false;
        if (_.isFunction(callback)) {
          self.hideBlock();
        }
      }
    },
    deleteAppendix: async function (item, index) {
      try {
        await $lycaon.axios.delete(`/api/v1/appendix/vote/${this.vote.id}/${item.id}`, {});
        this.appendix.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    },
    downloadAppendix: function (item) {
      return `/download/vote/${this.vote.id}/${item.id}`;
    },
    doForceUpdate: function () {
      this.formData.forceUpdate = true;

      var form = _.find(this.$children, {
        $el: $('#update-vote')[0],
      });
      form.submit();
    },
    submittedForm: async function (response) {
      if (response.isDeleteAnswers) {
        this.showForceModal = true;
      } else {
        this.cloudSuccess = true;
        this.syncing = true;
        location.href = `/${this.organization.handleId}/vote/${response.id}`;
      }
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.id = this.vote.id;
      argins.body = $lycaon.markdown.getMarkdown(this.voteEditor);
      argins.users = this.selectedUsers;
      argins.choices = this.selectedQuestions;
      argins.isQuestionnaireFormat = this.isQuestionnaireFormat;

      if (this.selectedDateRang && this.selectedDateRang.start) {
        this.selectedDateRang.start.setHours(0, 0, 0, 0);
        argins.circulationFrom = moment(this.selectedDateRang.start).valueOf();
      }
      if (this.selectedDateRang && this.selectedDateRang.end) {
        this.selectedDateRang.end.setHours(0, 0, 0, 0);
        argins.circulationTo = moment(this.selectedDateRang.end).valueOf();
      }

      // Validate
      if (!argins.subject) {
        this.formErrors.subject = true;
      }
      if (!argins.body) {
        this.formErrors.body = true;
      } else {
        if (new TextEncoder().encode(argins.body).length >= 2000000) {
          this.formErrors.bodyLength = true;
        }
      }

      if (argins.users.length < 1) {
        this.formErrors.users = true;
      }
      if (argins.isQuestionnaireFormat && !argins.question) {
        this.formErrors.question = true;
      }
      if (argins.isQuestionnaireFormat && argins.choices.length < 1) {
        this.formErrors.choices = true;
      }
      if (!argins.circulationFrom || !argins.circulationTo) {
        this.formErrors.period = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },
    hideImageListModal: function () {
      this.showImageListModal = false;
    },
    selectedImageList: function (image) {
      this.showImageListModal = false;
      this.voteEditor.insertText(`![](${image.virtualUrlMid})`);
    },
  },
  computed: {
    calendar: function () {
      return [
        {
          key: 'today',
          highlight: {
            color: 'indigo', // gray, red, orange, yellow, green, teal, blue, indigo, purple, pink.
            fillMode: 'light',
          },
          dates: new Date(),
          popover: {
            label: i18next.t('today'),
          },
        },
      ];
    },
    calendarMasks: function () {
      if (this.language === 'ja') {
        return { title: 'YYYY年M月', dayPopover: 'YYYY年M月D日(WWW) ' };
      }
      return { title: 'YYYY/MM', dayPopover: 'YYYY/MM/DD (WWW) ' };
    },
    returnLink: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }
      return `/${this.organization.handleId}/main`;
    },
    minDate: function () {
      var dt = new Date();
      dt.setHours(0, 0, 0, 0);
      if (this.vote.circulationFrom < dt.valueOf()) {
        return new Date(Number(this.vote.circulationFrom));
      }
      return new Date();
    },
  },
});
