parasails.registerPage('admin-team-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    selectedTeam: {},
    showDeleteModal: false,
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
      location.href = `/${this.organization.handleId}/admin/team/${pageNum}`;
    },
    link: function (item) {
      return `/${this.organization.handleId}/admin/team/edit/${item.id}`;
    },
    clickDeleteTeam: function (team) {
      this.selectedTeam = team;
      this.showDeleteModal = true;
    },
    doDelete: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-team-form')[0],
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
        id: this.selectedTeam.id,
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
