parasails.registerPage('new-organization', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    captcha: {},
    policyCecked: false,
    cloudSuccess: false,
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
  beforeMount: function () {},
  mounted: async function () {
    try {
      var response = await $lycaon.axios.get('/api/v1/captcha', {});
      if (response && response.data) {
        this.captcha = response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function (response) {
      if (response.invalidToken) {
        this.formErrors.captchaToken = true;
        return;
      }

      if (this.isBackOffice) {
        location.href = '/admin/organization';
      } else {
        this.cloudSuccess = true;
      }
    },

    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = _.extend({}, this.formData);

      // Validate
      if (!argins.handleId) {
        this.formErrors.handleId = true;
      } else {
        if ([...argins.handleId].length > 10) {
          this.formErrors.handleIdLength = true;
        }
      }

      var regex = new RegExp('^[a-zA-Z0-9]+$');

      if (argins.handleId && !argins.handleId.match(regex)) {
        this.formErrors.handleIdFormat = true;
      }

      if (!argins.name) {
        this.formErrors.name = true;
      } else {
        if ([...argins.name].length > 100) {
          this.formErrors.nameLength = true;
        }
      }

      if (!argins.fullName) {
        this.formErrors.fullName = true;
      } else {
        if ([...argins.fullName].length > 120) {
          this.formErrors.fullNameLength = true;
        }
      }

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

      if (!argins.captchaToken) {
        this.formErrors.captchaToken = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.isBackOffice = this.isBackOffice;

      return argins;
    },
    reloadCaptcha: async function () {
      try {
        this.formData.captchaText = '';
        var response = await $lycaon.axios.get('/api/v1/captcha', {});
        if (response && response.data) {
          this.captcha = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    image: function () {
      if (this.captcha.data) {
        return 'data:image/gif;base64,' + this.captcha.data;
      }
      return '';
    },
  },
});
