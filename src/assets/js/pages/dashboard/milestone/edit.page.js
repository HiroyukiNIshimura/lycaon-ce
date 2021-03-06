parasails.registerPage('milestone-edit', {
  mixins: [messageNotify],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    selectedDateRang: {},
    responsible: Number,
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
    if (this.milestone.user) {
      this.responsible = this.milestone.user;
    } else {
      this.responsible = '';
    }

    if (this.milestone.startAt) {
      this.selectedDateRang.start = new Date(Number(this.milestone.startAt));
    }
    if (this.milestone.startAt && this.milestone.duration) {
      var end = Number(this.milestone.startAt) + Number(this.milestone.duration);
      this.selectedDateRang.end = new Date(end);
    }

    this.formData.name = this.milestone.name;
  },
  mounted: async function () {
    //…
    $lycaon.invalidEnterKey();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    chooseMe: function () {
      this.responsible = this.me.id;
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/milestone/${response.team}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;

      // Validate
      if (!argins.name) {
        this.formErrors.name = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.id = this.milestone.id;

      if (this.selectedDateRang && this.selectedDateRang.start) {
        argins.startAt = moment(this.selectedDateRang.start).valueOf();
      }
      if (this.selectedDateRang && this.selectedDateRang.end) {
        argins.endAt = moment(this.selectedDateRang.end).valueOf();
      }
      if (Number(this.responsible) > 0) {
        argins.user = Number(this.responsible);
      }

      return argins;
    },
    submittedDeleteForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/milestone/${response.team}`;
    },
    handleParsingDeleteForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();
      var argins = { id: this.milestone.id };
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
      return `/${this.organization.handleId}/milestone/${this.team.id}`;
    },
  },
});
