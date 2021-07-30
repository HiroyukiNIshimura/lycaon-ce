parasails.registerPage('new-wiki', {
  mixins: [messageNotify],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    tagify: {},
    selectedTags: [],
    appendix: [],
    wikiEditor: {},
    tagifySettings: {},
    isUploading: false,
    showImageListModal: false,
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      subject: '',
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
    this.tagifySettings = {
      placeholder: i18next.t('You can tag up to {0}').format(10),
      enforceWhitelist: false,
      maxTags: 10,
      dropdown: {
        maxItems: 50,
      },
      whitelist: [],
    };

    var self = this;
    this.tags.forEach((entity) => {
      self.tagifySettings.whitelist.push(entity.name);
    });
  },
  mounted: async function () {
    var mode = 'vertical';
    if (window.matchMedia('(max-width:480px)').matches) {
      mode = 'tab';
    }
    this.wikiEditor = $lycaon.markdown.createEditor(
      '#wiki-editor',
      '600px',
      mode,
      i18next.t('Feel free to enter ...'),
      this.thread ? this.thread.body : '',
      this.addImageBlobHook.bind(this)
    );
    var self = this;
    $lycaon.markdown.addToolberImageList(this.wikiEditor, () => {
      self.$refs.imagelist.load();
      self.showImageListModal = true;
    });

    if (this.thread) {
      this.formData.subject = this.thread.subject;
    }

    $lycaon.invalidEnterKey();
  },
  watch: {
    appendix: function () {
      var totalsize = 0;
      _.each(this.appendix, (entry) => {
        totalsize += entry.size;
      });
      if (this.sysSettings.maxUploadFileSize < totalsize) {
        $lycaon.errorToast(
          'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
          [formatter.format(this.sysSettings.maxUploadFileSize)]
        );
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onChangeTags: function () {},
    onEditCancelClick: function () {
      if (this.backToUrl) {
        location.href = this.backToUrl;
      } else {
        location.href = `/${this.organization.handleId}/team/${this.team.id}`;
      }
    },
    addImageBlobHook: function (blob, callback) {
      var blobUrl = window.URL.createObjectURL(blob);
      blob.blobUrl = blobUrl;
      this.appendix.push(blob);
      if (_.isFunction(callback)) {
        return callback(blobUrl, blob.name);
      }
    },
    deleteAppendix: function (item, index) {
      var val = $lycaon.markdown.getMarkdown(this.wikiEditor);
      $lycaon.markdown.setMarkdown(this.wikiEditor, val.replace(item.blobUrl, ''));
      this.appendix.splice(index, 1);
    },
    downloadAppendix: function () {
      return 'javascript:void(0)';
    },
    fileLinksTarget: function (item) {
      if (item.type.startsWith('application')) {
        return '';
      }
      return '_blank';
    },
    uploadFile: async function (blob, id) {
      var data = new FormData();
      data.append('appendix', blob);

      try {
        var response = await $lycaon.axios.post(
          `/api/v1/appendix/createwiki/${id}`,
          data,
          {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          },
          {
            'x-bloburl': blob.blobUrl,
            'x-blobsize': blob.size,
          }
        );
        if (response.data.status === 'error') {
          return response.data.error;
        }
        return false;
      } catch (error) {
        console.log(error);
      }
    },

    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;

      var errors = [];
      for (let blob of this.appendix) {
        this.progressMessage = i18next.t('Uploading {0} ...').format(blob.name);
        var error = await this.uploadFile(blob, response.id);
        if (error) {
          errors.push(error);
        }
      }

      if (errors.length > 0) {
        if (errors.includes('maxQuota') || errors.includes('maxSizePerWiki') || errors.includes('maxFilePerWiki')) {
          location.href = `/uploaderror/wiki/${response.id}?plan=invalid`;
        } else {
          location.href = `/uploaderror/wiki/${response.id}`;
        }
      } else {
        location.href = `/${this.organization.handleId}/wiki/${response.no}`;
      }
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.body = $lycaon.markdown.getMarkdown(this.wikiEditor);
      argins.team = this.team.id;

      // Validate
      if (!argins.subject) {
        this.formErrors.subject = true;
      } else {
        if ([...argins.subject].length > 200) {
          this.formErrors.subjectLength = true;
        }
      }

      if (argins.body && new TextEncoder().encode(argins.body).length >= 2000000) {
        this.formErrors.bodyLength = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }
      argins.tags = this.selectedTags;

      return argins;
    },
    hideImageListModal: function () {
      this.showImageListModal = false;
    },
    selectedImageList: function (image) {
      this.showImageListModal = false;
      this.wikiEditor.insertText(`![](${image.virtualUrlMid})`);
    },
  },
  computed: {
    teamLink: function () {
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
  },
});
