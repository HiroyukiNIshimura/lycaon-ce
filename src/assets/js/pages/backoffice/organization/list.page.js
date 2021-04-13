parasails.registerPage('backoffice-organization-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    floatFormatter: floatFormatter,
    selectedItem: {},
    showDeleteModal: false,
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
      location.href = `/admin/organization?page=${pageNum}`;
    },
    planStyle: function (item) {
      switch (item.plan) {
        case 'pine':
          return 'badge-warning';
        case 'bamboo':
          return 'badge-success';
        case 'plum':
          return 'badge-danger';
        case 'free':
        default:
          return 'badge-primary';
      }
    },
    link: function (item) {
      return `/admin/organization/${item.id}`;
    },

    deleteOrganization: function (item) {
      this.selectedItem = item;
      this.showDeleteModal = true;
    },
    doDelete: function () {
      var form = _.find(this.$children, {
        $el: $('#form-delete-organization')[0],
      });
      form.submit();
    },
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.reload();
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      this.showDeleteModal = false;

      var argins = {
        id: this.selectedItem.id,
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
