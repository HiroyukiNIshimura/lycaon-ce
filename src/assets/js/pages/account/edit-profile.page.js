parasails.registerPage('edit-profile', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    cloudTags: [],
    tagifySettings: {},
    selectedTeams: [],

    cloudCategoryTags: [],
    categoryTagifySettings: {},
    selectedCategories: [],

    cloudTagTags: [],
    tagTagifySettings: {},
    selectedTags: [],

    avatarType: 'identify',
    hasAvatar: false,
    avatarUrl: '',
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
    // Set the form data.
    this.formData.fullName = this.me.fullName;
    this.formData.emailAddress = this.me.emailChangeCandidate
      ? this.me.emailChangeCandidate
      : this.me.emailAddress;

    this.formData.skil = this.me.skil;
    this.formData.notNeedMyOwnEmail = this.me.notNeedMyOwnEmail;
    this.formData.noRaiseThreadNotify = this.me.noRaiseThreadNotify;
    if (!this.me.languagePreference) {
      this.me.languagePreference = this.language;
    }
    this.formData.language = this.me.languagePreference;

    this.avatarType = this.me.avatarType;
    this.hasAvatar = this.me.avatarVirtualUrl ? true : false;
    this.avatarUrl = this.me.avatarVirtualUrl;

    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select teams if you need'),
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

    _.each(this.emailNoThankYous, (entry) => {
      var val = {
        value: entry.name,
        id: entry.id,
      };
      self.cloudTags.push(val);
    });

    this.categoryTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select categories if you need'),
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

    _.each(this.sendMailCategories, (entry) => {
      var val = {
        value: entry.name,
        id: entry.id,
      };
      self.cloudCategoryTags.push(val);
    });

    this.tagTagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('Select tags if you need'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
    });

    _.each(this.tags, (entry) => {
      self.tagTagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });

    _.each(this.sendMailTags, (entry) => {
      var val = {
        value: entry.name,
        id: entry.id,
      };
      self.cloudTagTags.push(val);
    });
  },
  mounted: async function () {
    this.$refs.tagify.addTags(this.cloudTags);
    this.$refs.tagifyCategory.addTags(this.cloudCategoryTags);
    this.$refs.tagifyTag.addTags(this.cloudTagTags);

    var self = this;
    io.socket.on('message-notify', function (response) {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);
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
    onAddCategoryTagify: function (e) {
      this.selectedCategories.push(e.detail.data);
    },
    onRemoveCategoryTagify: function (e) {
      this.selectedCategories = _.reject(this.selectedCategories, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    onAddTagTagify: function (e) {
      this.selectedTags.push(e.detail.data);
    },
    onRemoveTagTagify: function (e) {
      this.selectedTags = _.reject(this.selectedTags, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    submittedForm: async function () {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      window.location = `/${this.organization.handleId}/account`;
    },

    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.avatarType = this.avatarType;
      argins.selectedTeams = this.selectedTeams;
      argins.selectedCategories = this.selectedCategories;
      argins.selectedTags = this.selectedTags;

      // Validate name:
      if (!argins.fullName) {
        this.formErrors.fullName = true;
      } else {
        if (argins.fullName.length > 120) {
          this.formErrors.fullNameLength = true;
        }
      }

      // Validate email:
      if (!argins.emailAddress) {
        this.formErrors.emailAddress = true;
      } else {
        if (!parasails.util.isValidEmailAddress(argins.emailAddress)) {
          this.formErrors.emailAddress = true;
        }
        if (argins.emailAddress.length > 300) {
          this.formErrors.emailAddressLength = true;
        }
      }

      if (argins.skil.length > 1000) {
        this.formErrors.skil = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },
  },
  computed: {},
});
