const draggable = window['vuedraggable'];
parasails.registerPage('admin-category-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    categories: [],
    inDrag: false,
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
  components: {
    draggable: draggable,
  },
  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    //…
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
  },
});
