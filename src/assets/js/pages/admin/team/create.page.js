parasails.registerPage('admin-team-create', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    team: { isSandbox: false },
    cloudUsers: [],
    userTagifySettings: {},
    selectedUsers: [],
    cloudCategories: [],
    categoryTagifySettings: {},
    selectedCategories: [],
    useGit: false,
    connectType: 0,
    defaultConcept: 0,
    panelId: 'admin-team-tab-panel',

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
    this.userTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select users to join the team'),
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

    this.categoryTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select a category for your team'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
    });

    _.each(this.categories, (entry) => {
      self.categoryTagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });

    this.formData.gitOrigin = 'master';
    this.defaultConcept = 0;
  },
  mounted: async function () {
    this.$refs.userTagify.addTags(this.cloudUsers);
    this.$refs.categoryTagify.addTags(this.cloudCategories);

    if (this.unplanned) {
      $lycaon.infoKeepToast(
        'No more teams can be created with the current plan. Please consider updating your plan'
      );
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    tabChanged: function (selectedTab) {
      if (selectedTab.tab.id === 'tab-basic') {
        this.connectType = 0;
      }
      if (selectedTab.tab.id === 'tab-gitlab') {
        this.connectType = 1;
      }
    },
    onAddUserTagify: function (e) {
      this.selectedUsers.push(e.detail.data);
    },
    onRemoveUserTagify: function (e) {
      this.selectedUsers = _.reject(this.selectedUsers, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    onAddcategoryTagify: function (e) {
      this.selectedCategories.push(e.detail.data);
    },
    onRemovecategoryTagify: function (e) {
      this.selectedCategories = _.reject(this.selectedCategories, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/admin/team/edit/${response.id}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.selectedUsers = this.selectedUsers;
      argins.selectedCategories = this.selectedCategories;

      argins.useGit = this.useGit;
      argins.connectType = this.connectType;

      // Validate
      if (!argins.name) {
        this.formErrors.name = true;
      }
      if (argins.selectedCategories.length < 1) {
        this.formErrors.category = true;
      }

      if (argins.useGit) {
        if (argins.connectType === 0) {
          if (!argins.gitRepository) {
            this.formErrors.gitRepository = true;
          }
          if (!argins.gitUser) {
            this.formErrors.gitUser = true;
          }
          if (!argins.gitPassword) {
            this.formErrors.gitPassword = true;
          }
        }

        if (argins.connectType === 1) {
          if (!argins.gitOrigin) {
            argins.gitOrigin = 'master';
          }
          if (!argins.gitlabApi) {
            this.formErrors.gitlabApi = true;
          }
          if (!argins.gitlabToken) {
            this.formErrors.gitlabToken = true;
          }
          if (!argins.gitlabProjectId) {
            this.formErrors.gitlabProjectId = true;
          }
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.defaultConcept = this.defaultConcept;

      return argins;
    },
  },
});
