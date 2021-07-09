parasails.registerPage('edit-wiki', {
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
    cloudTags: [],

    conflictUser: {},
    newSubject: '',
    newBody: '',
    myBody: '',
    diff: [],
    showConflictModal: false,
    isUploading: false,
    viewerBlock: {},
    showImageListModal: false,
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
  beforeMount: function () {
    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('You can tag up to {0}').format(10),
      enforceWhitelist: false,
      maxTags: 10,
      dropdown: {
        maxItems: 50,
      },
    });

    var self = this;
    this.tags.forEach((entity) => {
      self.tagifySettings.whitelist.push(entity.name);
    });

    _.each(this.wiki.tags, (entry) => {
      self.cloudTags.push({
        value: entry.name,
        id: entry.id,
      });
    });

    this.formData.subject = this.wiki.subject;
    this.appendix = _.clone(this.wiki.items);
  },
  mounted: async function () {
    var self = this;
    window.onbeforeunload = function () {
      $lycaon.socket.post('/ws/v1/wiki-edit-out', { id: self.wiki.id });
    };

    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.data.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    var mode = 'vertical';
    if (window.matchMedia('(max-width:480px)').matches) {
      mode = 'tab';
    }
    this.wikiEditor = $lycaon.markdown.createEditor(
      '#wiki-editor',
      '600px',
      mode,
      i18next.t('Feel free to enter ...'),
      this.addImageBlobHook.bind(this)
    );
    $lycaon.markdown.addToolberImageList(this.wikiEditor, () => {
      self.wikiEditor.eventManager.emit('closeAllPopup');
      self.$refs.imagelist.load();
      self.showImageListModal = true;
    });
    this.wikiEditor.mdEditor.setValue(this.wiki.body);

    $lycaon.socket.post('/ws/v1/wiki-edit-in', { id: this.wiki.id }, () => {
      io.socket.on('wiki-edit-query', (data) => {
        if (data.user.id !== self.me.id) {
          $lycaon.socket.post('/ws/v1/wiki-edit-in', {
            id: self.wiki.id,
            queryUser: data.user,
            queryResponse: true,
          });
        }
      });
      io.socket.on('wiki-update', (data) => {
        if (data.user.id !== self.me.id && self.wiki.id === data.wiki.id) {
          self.newSubject = data.wiki.subject;
          self.newBody = data.wiki.body;
          self.conflictUser = data.user;
          self.myBody = self.wikiEditor.mdEditor.getValue();
          self.diff = $lycaon.diff(self.myBody, data.wiki.body);
          self.showConflictModal = true;
        }
      });
    });

    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }

    $lycaon.invalidEnterKey();

    this.selectedTags = _.extend([], this.cloudTags);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onChangeTags: function () {},
    onEditCancelClick: function () {
      location.href = `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    blockEditor: function (label) {
      this.viewerBlock = Vue.$loading.show(
        {
          container: this.$refs.wikiEditor,
          canCancel: false,
          color: '#000000',
          loader: 'dots',
          width: 64,
          height: 64,
          backgroundColor: '#ffffff',
          opacity: 0.5,
          zIndex: 999,
          isFullPage: false,
        },
        {
          before: this.$createElement('div', { class: 'loading-before' }, [label]),
        }
      );
    },
    hideBlock: function () {
      if (this.viewerBlock) {
        this.viewerBlock.hide();
      }
    },
    addImageBlobHook: async function (blob, callback) {
      var data = new FormData();
      data.append('appendix', blob);

      this.isUploading = true;
      if (_.isFunction(callback)) {
        this.blockEditor(this.i18n('Uploading {0} ...').format(this.i18n('File')));
      }

      var self = this;
      try {
        var response = await $lycaon.axios.post(
          `/api/v1/appendix/wiki/${this.wiki.id}`,
          data,
          {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          },
          {
            'x-blobsize': blob.size,
          }
        );

        if (response.data.status === 'error') {
          if (response.data.error === 'maxQuota') {
            $lycaon.infoKeepToast(
              'The current plan does not allow the entire organization to attach any more files. A storage limit has occurred. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxSizePerThread') {
            $lycaon.infoKeepToast(
              'No more files can be attached to this wiki with the current plan. You have reached the Wiki attachment size limit. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxFilePerThread') {
            $lycaon.infoKeepToast(
              'No more files can be attached to this wiki with the current plan. You have reached the Wiki attachment limit. Please consider updating your usage plan'
            );
          } else {
            $lycaon.errorToast(
              'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
              [formatter.format(this.sysSettings.maxUploadFileSize)]
            );
          }

          if (_.isFunction(callback)) {
            return callback(i18next.t('Upload error'), blob.name);
          }
        } else {
          self.appendix.push(response.data.item);
          if (_.isFunction(callback)) {
            return callback(response.data.urlMid, response.data.item.name);
          }
        }
      } catch (error) {
        console.log(error);
        $lycaon.errorToast(
          'It exceeds the size that can be uploaded at the same time. The maximum size that can be uploaded at the same time is {0} bytes',
          [formatter.format(this.sysSettings.maxUploadFileSize)]
        );

        if (_.isFunction(callback)) {
          return callback(i18next.t('Upload error'), blob.name);
        }
      } finally {
        self.isUploading = false;
        if (_.isFunction(callback)) {
          self.hideBlock();
        }
      }
    },
    deleteAppendix: async function (item, index) {
      try {
        await $lycaon.axios.delete(`/api/v1/appendix/wiki/${this.wiki.id}/${item.id}`, {});
        this.appendix.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    },
    downloadAppendix: function (item) {
      return `/download/wiki/${this.wiki.id}/${item.id}`;
    },
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.id = this.wiki.id;
      argins.body = this.wikiEditor.mdEditor.getValue();

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
