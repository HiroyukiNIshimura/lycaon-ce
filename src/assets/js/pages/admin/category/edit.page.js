parasails.registerPage('admin-category-edit', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    useTemplate: false,
    templateEditor: {},
    showUsingModal: false,
    //…
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      deleted: false,
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
    this.formData.id = this.category.id;
    this.formData.name = this.category.name;
    this.formData.displayOrder = this.category.displayOrder;
    this.useTemplate = this.category.useTemplate;
    this.formData.templateSubject = this.category.templateSubject;
  },
  mounted: async function () {
    this.templateEditor = $lycaon.markdown.createEditor(
      '#template-editor',
      '400px',
      'tab',
      i18next.t('Please fill in the template for the new thread created in this category ...'),
      this.category.templateBody
    );

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
      location.href = `/${this.organization.handleId}/admin/category/edit/${response.id}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.templateBody = $lycaon.markdown.getMarkdown(this.templateEditor);
      argins.useTemplate = this.useTemplate;

      // Validate
      if (!argins.name) {
        this.formErrors.name = true;
      }

      if (argins.useTemplate) {
        if (!argins.templateSubject || !argins.templateBody) {
          this.formErrors.templateBody = true;
        } else if (new TextEncoder().encode(argins.templateBody).length >= 2000000) {
          this.formErrors.bodyLength = true;
        }
      } else {
        delete argins.templateSubject;
        delete argins.templateBody;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },
  },
  computed: {},
});
