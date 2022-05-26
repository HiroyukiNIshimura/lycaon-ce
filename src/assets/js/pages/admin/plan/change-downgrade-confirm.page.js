parasails.registerPage('admin-plan-change-downgrade-confirm', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    changeDate: '',
    selectedDate: undefined,
    errorSelectedDate: false,
    reasons: [],
    errorReasons: false,
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
  beforeMount: function () { },
  mounted: async function () {
    //…
  },
  watch: {
    selectedDate: function (val) {
      if (val) {
        this.changeDate = $lycaon.formatter.formatDate(val);
      } else {
        this.changeDate = null;
      }
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/admin/plan/change/complete`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      this.errorSelectedDate = false;
      this.errorReasons = false;

      if (!this.changeDate) {
        this.errorSelectedDate = true;
      }

      if (this.reasons.length < 1) {
        this.errorReasons = true;
      }

      if (this.errorSelectedDate || this.errorReasons) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      var argins = {
        plan: this.plan,
        preferredDate: moment(this.selectedDate).valueOf(),
        reasons: this.reasons,
        grade: 'downgrade',
      };

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
    backToUrl: function () {
      return `/${this.organization.handleId}/admin/plan/change`;
    },
  },
});
