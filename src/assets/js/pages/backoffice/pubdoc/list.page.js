parasails.registerPage('backoffice-pubdoc-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    selectedWiki: {},
    showDeleteModal: false,
    showRecoverModal: false,
    currentPage: 1,

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
      location.href = '/admin/wikis/' + pageNum;
    },
    clickDetetOrRecver: function (item) {
      this.selectedWiki = item;
      if (item.deleted) {
        this.showRecoverModal = true;
      } else {
        this.showDeleteModal = true;
      }
    },
    doSubmit: function () {
      var form = _.find(this.$children, {
        $el: $('#update-deleted-form')[0],
      });
      form.submit();
    },
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/admin/pubdocs`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      this.showRecoverModal = false;
      this.showDeleteModal = false;

      var argins = { id: this.selectedWiki.id, deleted: !this.selectedWiki.deleted };
      return argins;
    },
    editLink: function (item) {
      return `/admin/pubdoc/edit/${item.id}`;
    },
  },
  computed: {
    getPageCount: function () {
      return Math.ceil(this.records / this.pagination.limit);
    },
  },
});
