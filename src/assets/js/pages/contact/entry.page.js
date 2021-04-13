parasails.registerPage('contact-entry', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    policyChecked: false,
    categories: [],
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
    if (this.formData.categories) {
      this.categories = this.formData.categories;
    }
  },
  mounted: async function () {
    //
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/contact/confirm`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;

      //form-full-name
      if (!argins.fullName) {
        this.formErrors.fullName = true;
      } else {
        if (argins.fullName.length > 120) {
          this.formErrors.fullNameLength = true;
        }
      }

      //form-emailAddress
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

      //form-contents
      if (!argins.contents) {
        this.formErrors.contents = true;
      } else {
        if (argins.contents.length > 2000) {
          this.formErrors.contentsLength = true;
        }
      }

      if (argins.organization && argins.organization.length > 100) {
        this.formErrors.organizationLength = true;
      }

      if (argins.zipCode && argins.zipCode.length > 50) {
        this.formErrors.zipCodeLength = true;
      }

      if (argins.prefecture && argins.prefecture.length > 50) {
        this.formErrors.prefectureLength = true;
      }

      if (argins.city && argins.city.length > 50) {
        this.formErrors.cityLength = true;
      }

      if (argins.street && argins.street.length > 100) {
        this.formErrors.streetLength = true;
      }

      if (argins.building && argins.building.length > 100) {
        this.formErrors.buildingLength = true;
      }

      if (argins.phoneNo && argins.phoneNo.length > 20) {
        this.formErrors.phoneNoLength = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');

        if (
          _.find(Object.keys(this.formErrors), function (key) {
            return key.startsWith('contents');
          })
        ) {
          $lycaon.jumpTo($('#form-contents'));
        } else if (
          _.find(Object.keys(this.formErrors), function (key) {
            return key.startsWith('fullName');
          })
        ) {
          $lycaon.jumpTo($('#form-full-name'));
        } else if (
          _.find(Object.keys(this.formErrors), function (key) {
            return key.startsWith('emailAddress');
          })
        ) {
          $lycaon.jumpTo($('#form-emailAddress'));
        }

        return;
      }

      argins.categories = this.categories;

      return argins;
    },
  },
  computed: {
    image: function () {
      return 'data:image/gif;base64,' + this.captcha.data;
    },
  },
});
