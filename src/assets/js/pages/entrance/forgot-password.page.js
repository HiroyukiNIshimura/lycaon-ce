parasails.registerPage('forgot-password', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    captcha: {},
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

    // Success state when form has been submitted
    cloudSuccess: false,
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

      this.cloudSuccess = true;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;

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

      if (!argins.captchaToken) {
        this.formErrors.captchaToken = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

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
