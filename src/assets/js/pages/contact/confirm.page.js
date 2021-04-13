parasails.registerPage('contact-confirm', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    category: '',
    captcha: {},
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
    var categories = [
      'Questions about application',
      'Questions about features',
      'On-premises quote',
      'Inquiries about disabilities',
      'Questions about cancellation',
      'Other',
    ];
    var buff = [];
    if (this.formData.categories && this.formData.categories.length > 0) {
      _.each(this.formData.categories, function (val) {
        buff.push(i18next.t(categories[val]));
      });

      this.category = buff.join(', ');
    }
  },
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
    //…
    submittedForm: async function (response) {
      if (response.invalidToken) { 
        this.formErrors.captchaToken = true;
        return;
      }
      
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/contact/complete`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;

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
