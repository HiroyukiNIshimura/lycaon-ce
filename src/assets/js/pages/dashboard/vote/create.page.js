parasails.registerPage('vote-create', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,

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
    //…
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      isQuestionnaireFormat: false,
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
    if (this.currentTeam) {
      this.selectedTeam = this.currentTeam;
    }

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

    _.each(this.users, (entry) => {
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
  },
  mounted: async function () {
    io.socket.on('message-notify', function (response) {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.data.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    var mode = 'vertical';
    if (window.matchMedia('(max-width:480px)').matches) {
      mode = 'tab';
    }
    this.voteEditor = $lycaon.markdown.createEditor(
      '#vote-editor',
      '300px',
      mode,
      i18next.t('Feel free to enter ...'),
      this.addImageBlobHook.bind(this)
    );

    this.voteEditor.mdEditor.setValue('');

    $lycaon.invalidEnterKey();
  },
  watch: {
    appendix: function (val) {
      var totalsize = 0;
      _.each(this.appendix, function (entry) {
        totalsize += entry.size;
      });
      if (this.sysSettings.maxUploadFileSize < totalsize) {
        $lycaon.errorToast(
          'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
          [formatter.format(this.sysSettings.maxUploadFileSize)]
        );
      }
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    addOrganizationAll: function () {
      this.$refs.userTagify.addTags(this.cloudUsers);
    },
    addTeamAll: function () {
      if (!this.selectedTeam) {
        return;
      }

      var users = _.filter(this.teamUsers, { team_users: this.selectedTeam });
      var targets = _.filter(this.cloudUsers, function (o) {
        if (_.findIndex(users, { user_teams: o.id }) > -1) {
          return true;
        }
        return false;
      });
      this.$refs.userTagify.addTags(targets);
    },
    clearAll: function () {
      this.selectedUsers = [];
      this.$refs.userTagify.removeAllTags();
    },
    onAddUserTagify: function (e) {
      this.selectedUsers.push(e.detail.data);
    },
    onRemoveUserTagify: function (e) {
      this.selectedUsers = _.reject(this.selectedUsers, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    onAddQuestionTagify: function (e) {
      this.selectedQuestions.push(e.detail.data);
    },
    onRemoveQuestionTagify: function (e) {
      this.selectedQuestions = _.reject(this.selectedQuestions, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    addImageBlobHook: function (blob, callback) {
      var blobUrl = window.URL.createObjectURL(blob);
      blob.blobUrl = blobUrl;
      this.appendix.push(blob);
      if (_.isFunction(callback)) {
        callback(blobUrl, blob.name);
      }
    },
    deleteAppendix: function (item, index) {
      var val = this.voteEditor.mdEditor.getValue();
      this.voteEditor.mdEditor.setValue(val.replace(item.blobUrl, ''));
      this.appendix.splice(index, 1);
    },
    downloadAppendix: function (item, index) {
      return 'javascript:void(0)';
    },
    fileLinksTarget: function (item) {
      if (item.type.startsWith('application')) {
        return '';
      }
      return '_blank';
    },
    uploadFile: async function (blob, id) {
      var data = new FormData();
      data.append('appendix', blob);

      try {
        var response = await $lycaon.axios.post(
          `/api/v1/appendix/createvote/${id}`,
          data,
          {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          },
          {
            'x-bloburl': blob.blobUrl,
            'x-blobsize': blob.size,
          }
        );

        if (response.data.status === 'error') {
          return response.data.error;
        }
        return false;
      } catch (error) {
        console.log(error);
      }
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;

      var errors = [];
      for (let blob of this.appendix) {
        this.progressMessage = i18next.t('Uploading {0} ...').format(blob.name);
        var error = await this.uploadFile(blob, response.id);
        if (error) {
          errors.push(error);
        }
      }

      if (errors.length > 0) {
        if (
          errors.includes('maxQuota') ||
          errors.includes('maxSizePerVote') ||
          errors.includes('maxFilePerVote')
        ) {
          location.href = `/uploaderror/vote/${response.id}?plan=invalid`;
        } else {
          location.href = `/uploaderror/vote/${response.id}`;
        }
      } else {
        location.href = `/${this.organization.handleId}/vote/${response.id}`;
      }
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.body = this.voteEditor.mdEditor.getValue();
      argins.users = this.selectedUsers;
      argins.choices = this.selectedQuestions;

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
      return new Date();
    },
  },
});
