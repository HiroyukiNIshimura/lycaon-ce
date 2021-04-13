parasails.registerPage('admin-user-edit', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    cloudTags: [],
    selectedTeams: [],
    tagifySettings: {},

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
    this.formData.id = this.user.id;
    this.formData.name = this.user.fullName;
    this.formData.email = this.user.emailAddress;
    this.formData.role = this.user.isSuperAdmin ? 1 : 0;
    this.formData.deleted = this.user.deleted;

    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Please select a team to join'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
    });

    var self = this;
    _.each(this.teams, (entry) => {
      self.tagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });

    _.each(this.user.teams, (entry) => {
      var val = {
        value: entry.name,
        id: entry.id,
      };
      if (entry.isSandbox) {
        val.readonly = true;
      }
      self.cloudTags.push(val);
    });
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
      this.selectedTeams.push(e.detail.data);
    },
    onRemoveTagify: function (e) {
      this.selectedTeams = _.reject(this.selectedTeams, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/admin/user/edit/${response.id}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.selectedTeams = this.selectedTeams;

      // Validate
      if (!argins.name) {
        this.formErrors.name = true;
      }
      if (!argins.email) {
        this.formErrors.email = true;
      }
      if (argins.selectedTeams.length < 1) {
        this.formErrors.teams = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.isSuperAdmin = argins.role == '1' ? true : false;

      return argins;
    },
  },
});
