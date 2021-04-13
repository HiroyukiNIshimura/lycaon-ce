parasails.registerPage('admin-user-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    selectedUser: {},
    showDeleteModal: false,
    showResetModal: false,
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
    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickCallback: function (pageNum) {
      location.href = `/${this.organization.handleId}/admin/users/${pageNum}`;
    },
    link: function (item) {
      return `/${this.organization.handleId}/admin/user/edit/${item.id}`;
    },
    infoLink: function (item) {
      return `/${this.organization.handleId}/member/${item.id}`;
    },
    clickResetPassword: function (user) {
      this.selectedUser = user;
      this.showResetModal = true;
    },
    doResetPassword: function (user) {
      var form = _.find(this.$children, {
        $el: $('#reset-password-form')[0],
      });
      form.submit();
    },
    submittedResetForm: async function (response) {
      $lycaon.successToast('A password reset email has been sent to user {0} {1}', [
        response.id,
        response.fullName,
      ]);
      this.cloudSuccess = true;
    },
    handleParsingResetForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      this.showResetModal = false;

      var argins = {
        id: this.selectedUser.id,
      };

      return argins;
    },
    clickDeleteUser: function (user) {
      this.selectedUser = user;
      this.showDeleteModal = true;
    },
    doDelete: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-user-form')[0],
      });
      form.submit();
    },
    submittedDeleteForm: async function (response) {
      this.cloudSuccess = true;
      location.reload();
    },
    handleParsingDeleteForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      this.showDeleteModal = false;

      var argins = {
        id: this.selectedUser.id,
      };

      return argins;
    },
  },
  computed: {
    getPageCount: function () {
      return Math.ceil(this.records / this.pagination.limit);
    },
  },
});
