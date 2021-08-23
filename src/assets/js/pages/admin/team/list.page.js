parasails.registerPage('admin-team-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    selectedTeam: {},
    showDeleteModal: false,
    deleteBtnDisabled: false,
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      deletePin: '',
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
  watch: {
    'formData.deletePin': function (val) {
      if (val === this.deletePin) {
        this.deleteBtnDisabled = false;
      } else {
        this.deleteBtnDisabled = true;
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickCallback: function (pageNum) {
      location.href = `/${this.organization.handleId}/admin/team/${pageNum}`;
    },
    link: function (item) {
      return `/${this.organization.handleId}/admin/team/edit/${item.id}`;
    },
    clickDeleteTeam: function (team) {
      this.selectedTeam = team;
      this.showDeleteModal = true;
      this.deleteBtnDisabled = true;
    },
    doDelete: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-team-form')[0],
      });
      form.submit();
    },
    submittedDeleteForm: async function () {
      this.cloudSuccess = true;
      location.reload();
    },
    handleParsingDeleteForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      this.showDeleteModal = false;

      var argins = {
        id: this.selectedTeam.id,
      };

      return argins;
    },
  },
  computed: {
    getPageCount: function () {
      return Math.ceil(this.records / this.pagination.limit);
    },
    deletePinInfo: function () {
      return this.i18n(`Please enter '{0}' for confirmation`, [this.deletePin]);
    },
  },
});
