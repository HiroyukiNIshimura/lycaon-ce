parasails.registerPage('backoffice-notification-create', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatDate: $lycaon.formatter.formatDate,
    selectedDate: undefined,
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
    var dt = new Date();
    //3日後
    dt.setDate(dt.getDate() + 3);
    dt.setHours(0, 0, 0, 0);
    this.selectedDate = dt;

    this.formData.category = 'notice';
  },
  mounted: async function () { },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;

      location.href = `/admin/notification/${response.id}`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;

      if (!argins.subject) {
        this.formErrors.subject = true;
      } else {
        if ([...argins.subject].length > 200) {
          this.formErrors.subjectLength = true;
        }
      }

      if (!argins.body) {
        this.formErrors.body = true;
      } else {
        if ([...argins.body].length > 5000) {
          this.formErrors.bodyLength = true;
        }
      }

      if (!this.selectedDate) {
        this.formErrors.postingAt = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      this.selectedDate.setHours(0, 0, 0, 0);
      argins.postingAt = this.selectedDate.valueOf();

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
    minDate: function () {
      return new Date();
    },
  },
});
