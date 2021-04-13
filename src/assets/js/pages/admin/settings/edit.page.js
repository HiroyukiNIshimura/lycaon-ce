parasails.registerPage('admin-settings-edit', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    maxUploadFileSize: 0,
    tagifySettings: {},
    cloudTags: [],
    selectedExts: [],
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      weeklyReportDay: 0,
      maxUploadFileSize: 0,
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
    _.extend(this.formData, this.sysSettings);

    this.maxUploadFileSize = this.sysSettings.maxUploadFileSize / 1024;

    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select a team that does not require email notification'),
      enforceWhitelist: false,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
    });

    var self = this;
    _.each(this.witeListOfExts, (entry) => {
      self.tagifySettings.whitelist.push({
        value: entry.replace('.', ''),
        id: entry,
      });
    });

    if (this.sysSettings.witeListOfExts) {
      var exts = this.sysSettings.witeListOfExts.split(',');
      _.each(exts, (entry) => {
        var val = {
          value: entry,
          id: '.' + entry,
        };
        self.cloudTags.push(val);
      });
    }
  },
  mounted: async function () {
    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
    this.$refs.tagify.addTags(this.cloudTags);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onAddTagify: function (e) {
      this.selectedExts.push(e.detail.data);
    },
    onRemoveTagify: function (e) {
      this.selectedExts = _.reject(this.selectedExts, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/admin/settings`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.maxUploadFileSize = this.maxUploadFileSize * 1024;

      // Validate
      if (this.enabledFilesize) {
        if (
          !argins.maxUploadFileSize ||
          !Number.isInteger(argins.maxUploadFileSize) ||
          argins.maxUploadFileSize <= 0 ||
          argins.maxUploadFileSize > 1024 * 1024 * 500
        ) {
          this.formErrors.maxUploadFileSize = true;
        }
      }

      if (!argins.notMailSend && !argins.fromEmailAddress) {
        this.formErrors.fromEmailAddress = true;
      }
      if (!argins.notSendBackoffice && !argins.internalEmailAddress) {
        this.formErrors.internalEmailAddress = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.witeListOfExts = this.selectedExts
        .map((o) => {
          return o.value;
        })
        .join(',');

      return argins;
    },
  },
  computed: {
    enabledFilesize: function () {
      return this.organization.plan === 'bamboo' || this.organization.plan === 'plum';
    },
  },
});
