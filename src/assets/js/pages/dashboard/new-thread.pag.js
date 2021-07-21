parasails.registerPage('new-thread', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    threadEditor: {},
    tagify: {},
    selectedTags: [],
    selectedCategory: Number,
    showTemplateSw: false,
    tagifySettings: {},
    viewer: {},
    appendix: [],
    local: false,
    responsible: '',
    selectedMilestone: '',
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

    this.selectedMilestone = '';
    if (this.fork) {
      this.formData.fork = this.fork.id;
      if (this.fork.milestone) {
        this.selectedMilestone = this.fork.milestone;
      }
    }

    this.formData.concept = 0;
    this.formData.local = false;

    if (this.categories && this.categories.length > 0) {
      if (this.fork) {
        this.selectedCategory = this.fork.category.id;
      } else {
        this.formData.category = _.first(this.categories).id;
        this.selectedCategory = this.formData.category;
      }
    }

    this.formData.concept = this.team.defaultConcept;
  },
  mounted: async function () {
    if (!this.categories || this.categories.length < 1) {
      $lycaon.warningToast('Please set the category to be used in the team settings');
    }

    var self = this;
    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    var mode = 'vertical';
    if (window.matchMedia('(max-width:480px)').matches) {
      mode = 'tab';
    }
    this.threadEditor = $lycaon.markdown.createEditor(
      '#thread-editor',
      '600px',
      mode,
      i18next.t('Feel free to enter ...'),
      '',
      this.addImageBlobHook.bind(this)
    );
    $lycaon.markdown.addToolberImageList(self.threadEditor, () => {
      self.$refs.imagelist.load();
      self.showImageListModal = true;
    });

    $lycaon.invalidEnterKey();
    $lycaon.scrollTop();
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
    selectedCategory: function (val) {
      this.formData.category = val;

      var category = _.find(this.categories, { id: val });
      if (category.useTemplate) {
        this.showTemplateSw = true;
      } else {
        this.showTemplateSw = false;
      }
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    chooseTemplate: function () {
      var category = _.find(this.categories, { id: this.selectedCategory });
      var regexp = new RegExp(/yyyy\/mm\/dd/, 'ig');
      var dt = moment(new Date());
      var subject = category.templateSubject;
      var body = category.templateBody;
      subject = subject.replace(regexp, dt.format('YYYY/MM/DD'));
      body = body.replace(regexp, dt.format('YYYY/MM/DD'));

      $lycaon.markdown.setMarkdown(this.threadEditor, body);
      this.$set(this.formData, 'subject', subject);
      $('#thread-subject').focus();
    },
    onChangeTags: function () {},
    onEditCancelClick: function () {
      location.href = this.backToUrl;
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
      var val = $lycaon.markdown.getMarkdown(this.threadEditor);
      $lycaon.markdown.setMarkdown(this.threadEditor, val.replace(item.blobUrl, ''));
      this.appendix.splice(index, 1);
    },
    downloadAppendix: function () {
      return 'javascript:void(0)';
    },
    parseAppendixUrl: function (item) {
      return '/' + item.virtualPath;
    },
    forkLink: function () {
      return `/${this.organization.handleId}/thread/${this.fork.no}`;
    },
    chooseMe: function () {
      this.responsible = this.me.id;
    },
    uploadFile: async function (blob, id) {
      var data = new FormData();
      data.append('appendix', blob);

      try {
        var response = await $lycaon.axios.post(
          `/api/v1/appendix/createthread/${id}`,
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
    sendMail: async function (id) {
      try {
        await $lycaon.axios.post(`/api/v1/thread/mail/created/${id}`, {});
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

      if (this.appendix.length > 0) {
        this.progressMessage = i18next.t('A little more ...');
      }

      await this.sendMail(response.id);
      if (errors.length > 0) {
        if (errors.includes('maxQuota') || errors.includes('maxSizePerThread') || errors.includes('maxFilePerThread')) {
          location.href = `/uploaderror/thread/${response.id}?plan=invalid`;
        } else {
          location.href = `/uploaderror/thread/${response.id}`;
        }
      } else {
        location.href = `/${this.organization.handleId}/thread/${response.no}`;
      }
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = this.formData;
      argins.body = $lycaon.markdown.getMarkdown(this.threadEditor);
      argins.team = this.team.id;
      argins.local = this.local;
      if (Number(this.responsible) > 0) {
        argins.responsible = Number(this.responsible);
      }
      if (Number(this.selectedMilestone) > 0) {
        argins.milestone = Number(this.selectedMilestone);
      }

      // Validate
      if (!argins.subject) {
        this.formErrors.subject = true;
      } else {
        if ([...argins.subject].length > 200) {
          this.formErrors.subjectLength = true;
        }
      }

      if (!argins.category) {
        this.formErrors.category = true;
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
      this.threadEditor.insertText(`![](${image.virtualUrlMid})`);
    },
  },
  computed: {
    teamLink: function () {
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
    isThreadFork: function () {
      return this.fork;
    },
    storageKey: function () {
      return `lycaon-auto-choose-milestone.cache.${window.location.host}`;
    },
  },
});
