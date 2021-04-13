parasails.registerPage('backoffice-organization-edit', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    showCancelPlanChangeModal: false,
    showCancelUnsubscribedModal: false,
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

  /*
  ⭐︎⭐︎⭐︎
  this.organizationはリクエストに共通セットされているログインユーザーのものとなるので注意！
　扱う組織は「this.org」
   */

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.formData.plan = this.org.plan;
    this.formData.deleted = this.org.deleted;

    if (this.billing) {
      this.formData.customerName = this.billing.customerName;
      this.formData.zipCode = this.billing.zipCode;
      this.formData.prefecture = this.billing.prefecture;
      this.formData.city = this.billing.city;
      this.formData.street = this.billing.street;
      this.formData.building = this.billing.building;
      this.formData.phoneNo = this.billing.phoneNo;
    }
  },
  mounted: async function () {
    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/admin/organization/${response.id}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.id = this.org.id;

      // Validate
      if (argins.zipCode) {
        var regZip = new RegExp('^[0-9]{7}$');
        var regZip2 = new RegExp('^[0-9]{3}-[0-9]{4}$');

        if (!argins.zipCode.match(regZip) && !argins.zipCode.match(regZip2)) {
          this.formErrors.zipCode = true;
        }
      }

      if (argins.phoneNo) {
        var regPhone = new RegExp('^0[0-9]{1,3}-[0-9]{2,4}-[0-9]{3,4}$');
        var regPhone2 = new RegExp('^0[0-9]{10,11}$');
        if (!argins.phoneNo.match(regPhone) && !argins.phoneNo.match(regPhone2)) {
          this.formErrors.phoneNo = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },

    doCancelPlanChange: function () {
      var form = _.find(this.$children, {
        $el: $('#form-cancel-plan-change')[0],
      });
      form.submit();
    },
    doCancelUnsubscribed: function () {
      var form = _.find(this.$children, {
        $el: $('#form-cancel-unsubscribed')[0],
      });
      form.submit();
    },
    handleParsingCancelForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = { id: this.org.id };
      return argins;
    },
  },
});
