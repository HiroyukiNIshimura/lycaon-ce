parasails.registerPage('edit-profile', {
  mixins: [messageNotify],
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
    viewActivity: '0',
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
    this.formData.emailAddress = this.me.emailChangeCandidate ? this.me.emailChangeCandidate : this.me.emailAddress;

    this.formData.skil = this.me.skil;
    this.formData.notNeedMyOwnEmail = this.me.notNeedMyOwnEmail;
    this.formData.noRaiseThreadNotify = this.me.noRaiseThreadNotify;
    this.formData.noRaiseInoutNotify = this.me.noRaiseInoutNotify;
    if (!this.me.languagePreference) {
      this.me.languagePreference = this.language;
    }
    this.formData.language = this.me.languagePreference;
    this.formData.viewActivity = this.me.viewActivity;

    this.avatarType = this.me.avatarType;
    this.hasAvatar = this.me.avatarVirtualUrl ? true : false;
    this.avatarUrl = this.me.avatarVirtualUrl;

    this.tagifySettings = {
      placeholder: i18next.t('Select teams if you need'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
      whitelist: [],
    };

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

    this.categoryTagifySettings = {
      placeholder: i18next.t('Select categories if you need'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
      whitelist: [],
    };

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

    this.tagTagifySettings = {
      placeholder: i18next.t('Select tags if you need'),
      enforceWhitelist: true,
      maxTags: undefined,
      dropdown: {
        maxItems: undefined,
      },
      whitelist: [],
    };

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
    this.selectedTeams = _.extend([], this.cloudTags);
    this.selectedCategories = _.extend([], this.cloudCategoryTags);
    this.selectedTags = _.extend([], this.cloudTagTags);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onTeamSelectorChange: function () {},
    onCategorySelectorChange: function () {},
    onTagSelectorChange: function () {},
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
        if ([...argins.fullName].length > 120) {
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
        if ([...argins.emailAddress].length > 300) {
          this.formErrors.emailAddressLength = true;
        }
      }

      if ([...argins.skil].length > 1000) {
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
