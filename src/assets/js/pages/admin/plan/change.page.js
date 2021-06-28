parasails.registerPage('admin-plan-change', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    floatFormatter: floatFormatter,

    billboards: [],
    selected: Number,
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
    var i = 0;
    for (let key of Object.keys(this.plans)) {
      if (this.organization.plan === key) {
        this.selected = i;
      }

      var classFeeling = '';
      if (key === 'free') {
        classFeeling = this.i18n('Trial plan');
      }
      if (key === 'prime') {
        classFeeling = this.i18n('First of all, an introductory plan');
      }
      if (key === 'pine') {
        classFeeling = this.i18n('For individuals and small organizations');
      }
      if (key === 'bamboo') {
        classFeeling = this.i18n('For medium-sized organizations and schools');
      }
      if (key === 'plum') {
        classFeeling = this.i18n('For large organizations and enterprises');
      }

      this.billboards.push({
        name: key,
        classFeeling: classFeeling,
        maxUser: this.plans[key].maxUser ? this.plans[key].maxUser : this.i18n('Unlimited'),
        maxTeam: this.plans[key].maxTeam ? this.plans[key].maxTeam : this.i18n('Unlimited'),
        maxSizePerThread: this.plans[key].maxSizePerThread
          ? this.i18n('Up to {0} MB').format(this.formatter.format(this.plans[key].maxSizePerThread / 1024 / 1024))
          : this.i18n('Unlimited'),
        maxFilePerThread: this.plans[key].maxFilePerThread
          ? this.i18n('Up to {0} files').format(this.formatter.format(this.plans[key].maxFilePerThread))
          : this.i18n('Unlimited'),
        maxSizePerWiki: this.plans[key].maxSizePerWiki
          ? this.i18n('Up to {0} MB').format(this.formatter.format(this.plans[key].maxSizePerWiki / 1024 / 1024))
          : this.i18n('Unlimited'),
        maxFilePerWiki: this.plans[key].maxFilePerWiki
          ? this.i18n('Up to {0} files').format(this.formatter.format(this.plans[key].maxFilePerWiki))
          : this.i18n('Unlimited'),
        maxSizePerVote: this.plans[key].maxSizePerVote
          ? this.i18n('Up to {0} MB').format(this.formatter.format(this.plans[key].maxSizePerVote / 1024 / 1024))
          : this.i18n('Unlimited'),
        maxFilePerVote: this.plans[key].maxFilePerVote
          ? this.i18n('Up to {0} files').format(this.formatter.format(this.plans[key].maxFilePerVote))
          : this.i18n('Unlimited'),
        maxQuota: this.plans[key].maxQuota
          ? this.i18n('Up to {0} GB').format(this.formatter.format(this.plans[key].maxQuota / 1024 / 1024 / 1024))
          : this.i18n('Unlimited'),
        allowUseGit: this.plans[key].allowUseGit ? this.i18n('Available') : this.i18n('Not available'),
      });

      i++;
    }
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      if (response.grade === 'upgrade') {
        location.href = `/${this.organization.handleId}/admin/plan/change/upgrade/${response.after}`;
      } else {
        location.href = `/${this.organization.handleId}/admin/plan/change/downgrade/${response.after}`;
      }
    },
    handleParsingForm: function () {
      this.formErrors = {};

      var argins = {
        plan: Object.keys(this.plans)[this.selected],
      };

      return argins;
    },
    getId: function (index) {
      return `form-select-check-${index}`;
    },
    bgClass: function (plan) {
      if (this.organization.plan === plan) {
        return 'bg-light border-primary';
      }

      var index = _.findIndex(this.billboards, (o) => {
        return o.name === plan;
      });

      if (this.selected === index) {
        return 'border-warning';
      }

      return '';
    },
    isCurrent: function (index) {
      var self = this;
      var meIndex = _.findIndex(this.billboards, (o) => {
        return o.name === self.organization.plan;
      });
      return index === meIndex;
    },
  },
  computed: {
    allowSubmit: function () {
      var self = this;
      var index = _.findIndex(this.billboards, (o) => {
        return o.name === self.organization.plan;
      });

      return this.selected !== index;
    },
  },
});
