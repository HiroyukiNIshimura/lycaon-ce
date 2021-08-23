parasails.registerPage('admin-category-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    categories: [],
    inDrag: false,
    selectedCategory: {},
    showDeleteModal: false,
    deleteBtnDisabled: false,
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      deletePin: '',
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
  components: {
    draggable: draggable,
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
    link: function (item) {
      return `/${this.organization.handleId}/admin/category/edit/${item.id}`;
    },
    onChanged: function (e) {
      if (e.moved) {
        _.each(this.categories, (entry, index) => {
          entry.displayOrder = index + 1;
        });

        var form = _.find(this.$children, {
          $el: $('#update-order-form')[0],
        });
        form.submit();
      }
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.categories = response.categories;

      $lycaon.successToast('The display order of categories has been changed');
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        orderSet: [],
      };
      _.each(this.categories, (entry) => {
        argins.orderSet.push({
          id: entry.id,
          displayOrder: entry.displayOrder,
        });
      });

      // Validate
      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },
    clickDeleteCategory: function (category) {
      this.selectedCategory = category;
      this.showDeleteModal = true;
      this.deleteBtnDisabled = true;
    },
    doDelete: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-category-form')[0],
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
        id: this.selectedCategory.id,
      };

      return argins;
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        team: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    deletePinInfo: function () {
      return this.i18n(`Please enter '{0}' for confirmation`, [this.deletePin]);
    },
  },
});
