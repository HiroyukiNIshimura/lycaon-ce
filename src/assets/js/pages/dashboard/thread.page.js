parasails.registerPage('thread', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    formatDate: $lycaon.formatter.formatDate,
    thread: {},
    fork: null,
    threadEditor: {},
    commentEditor: {},
    sneezeEditor: {},
    replyEditor: {},
    replyRegister: {},
    threadMode: 'view',
    cloudTags: [],
    selectedTags: [],
    tagifySettings: {},
    isClosed: false,
    viewer: {},
    openCommentIdentity: null,
    openReplyIdentity: null,
    currentSneeze: null,
    sneezeStates: [],
    replyStates: [],
    replyRegisterStates: [],
    appendix: [],
    local: false,
    status: 0,
    viewActivity: 0,
    selectedResponsible: '',
    isThreadEditDisabled: false,
    parentSelected: {},
    childSelected: {},
    jumpSelected: {},
    dueDate: '', //for display
    selectedDate: {},
    minDate: undefined,
    maxDate: undefined,
    priority: 0,
    responsible: Number,
    membersPage: 1,
    allMembers: [],
    selectedMilestone: '',
    viewerBlock: {},
    conflictUser: {},
    newSubject: '',
    newBody: '',
    myBody: '',
    diff: [],
    subjectCache: [],
    isUploading: false,
    refsUpdate: 0,
    clipperMessage: '',
    role: 'tooltip',
    isCommentArrived: false,
    //dialogs
    showRefsUpdateModal: false,
    showDeleteParentModal: false,
    showDeleteChildModal: false,
    showMemberModal: false,
    showConflictModal: false,
    showEmotionsModal: false,
    showImageListModal: false,
    emotionsRadar: {},
    rightSidebar: 'noactive',
    sidebarCollapse: 'active',
    mainContents: 'active',
    reloaded: false,
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
    this.refsUpdate = 0;
    this.clipperMessage = i18next.t('Copy thread No');

    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('You can tag up to {0}').format(10),
      enforceWhitelist: false,
      maxTags: 10,
      dropdown: {
        maxItems: 50,
      },
    });

    var self = this;
    _.each(this.tags, (entry) => {
      self.tagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });

    _.each(this.thread.tags, (entry) => {
      self.cloudTags.push({
        value: entry.name,
        id: entry.id,
      });
    });

    this.isClosed = this.thread.status === 1;

    this.appendix = _.clone(this.thread.items);
    this.local = this.thread.local;
    this.status = this.thread.status;
    if (this.thread.responsible) {
      this.selectedResponsible = this.thread.responsible.id;
    }
    if (this.thread.dueDateAt) {
      this.selectedDate = new Date(Number(this.thread.dueDateAt));
      this.dueDate = $lycaon.formatter.formatDate(this.thread.dueDate);
    }
    if (this.thread.milestone) {
      this.selectedMilestone = this.thread.milestone.id;
    }

    this.priority = this.thread.priority;
    if (this.thread.responsible) {
      this.responsible = this.thread.responsible.id;
    } else {
      this.responsible = '';
    }
  },
  mounted: async function () {
    //https://nhn.github.io/tui.editor
    this.viewer = $lycaon.markdown.createViewer('#viewer', this.thread.body, '100%');

    var self = this;
    window.onbeforeunload = function () {
      if (self.threadMode === 'edit') {
        $lycaon.socket.post('/ws/v1/thread-edit-out', { id: self.thread.id }, () => {
          if (!self.reloaded) {
            $lycaon.socket.post('/ws/v1/thread-out', { id: self.thread.id });
          }
        });
      }
      if (!self.reloaded) {
        $lycaon.socket.post('/ws/v1/thread-out', { id: self.thread.id });
      }
    };

    io.socket.on('thread-notify', (data) => {
      if (data.user.id !== self.me.id && data.message) {
        $lycaon.socketToast(data.message);
        if (self.thread.id === data.thread.id) {
          self.thread = Object.assign({}, self.thread, {
            working: data.thread.working,
            status: data.thread.status,
            concept: data.thread.concept,
            locked: data.thread.locked,
            workingUser: data.user,
            dueDate: data.dueDate,
          });
          self.status = self.thread.status;
        }
      }
    });

    io.socket.on('comment-notify', (data) => {
      if (data.user.id !== self.me.id) {
        $lycaon.socketToast(data.message);
        if (self.thread.id === data.id) {
          var id = self.parseUserId(data.user);
          var selector = '#' + id;
          $(selector).attr('data-toggle', 'tooltip');
          $(selector).attr('data-trigger', 'manual');
          $(selector).attr('data-placement', 'bottom');
          $(selector).attr('title', data.comment);
          $(selector).tooltip({ offset: 5, container: $(selector) });
          $(selector).tooltip('show');

          setTimeout(() => {
            //$(selector).tooltip('dispose');
          }, 5000);

          self.isCommentArrived = true;
          //
        }
      }
    });

    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    $lycaon.socket.post('/ws/v1/thread-in', { id: this.thread.id }, () => {
      $lycaon.socket.post('/ws/v1/thread-edit-query', { id: self.thread.id }, () => {
        io.socket.on('thread-edit-query', (data) => {
          if (data.user.id !== self.me.id && self.threadMode === 'edit') {
            $lycaon.socket.post('/ws/v1/thread-edit-in', {
              id: self.thread.id,
              queryUser: data.user,
              queryResponse: true,
            });
          }
        });
      });
      io.socket.on('thread-in', (data) => {
        var id = self.parseUserId(data.user);
        $('#' + id).addClass('blink');
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
        }
        $lycaon.socket.post('/ws/v1/thread-pon', { id: self.thread.id, user: self.me });
      });
      io.socket.on('thread-out', (data) => {
        var id = self.parseUserId(data.user);
        $('#' + id).removeClass('blink');
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
        }
      });
      io.socket.on('thread-pon', (data) => {
        if (data.user.id !== self.me.id) {
          var id = self.parseUserId(data.user);
          $('#' + id).addClass('blink');
        }
      });
      io.socket.on('thread-edit-in', (data) => {
        if (data.queryUser && data.queryUser.id === self.me.id) {
          $lycaon.socketToast(data.message);
          self.isThreadEditDisabled = true;
          self.blockViewer(i18next.t('This thread is being edited by {0} ...').format(data.user.fullName));
        } else if (!data.queryUser && data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
          self.isThreadEditDisabled = true;
          self.blockViewer(i18next.t('This thread is being edited by {0} ...').format(data.user.fullName));
        }
      });
      io.socket.on('thread-edit-out', (data) => {
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
          self.isThreadEditDisabled = false;
          self.hideBlock();
        }
      });
      io.socket.on('thread-update', (data) => {
        if (data.user.id !== self.me.id && self.thread.id === data.thread.id) {
          if (self.threadMode === 'edit') {
            self.newSubject = data.thread.subject;
            self.newBody = data.thread.body;
            self.conflictUser = data.user;
            self.myBody = self.threadEditor.mdEditor.getValue();
            self.diff = $lycaon.diff(self.myBody, data.thread.body);
            self.showConflictModal = true;
          } else {
            $lycaon.infoKeepToast(data.message.key, data.message.params);
            self.thread = Object.assign({}, self.thread, {
              subject: data.thread.subject,
              body: data.thread.body,
            });
            self.viewer.setMarkdown(data.thread.body);
          }
        }
      });
    });

    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
    if (this.errorMessage) {
      $lycaon.cloudErrorToast(this.errorMessage);
    }

    this.selectedTags = _.extend([], this.cloudTags);

    this.commentEditor = $lycaon.markdown.createEditor(
      '#comment-editor',
      '300px',
      'tab',
      i18next.t('Feel free to enter your comments ...'),
      this.addImageBlobHook.bind(this)
    );

    this.sneezes.forEach((entity) => {
      var id = this.getCommentIdentity(entity);
      this.sneezeStates.push(false);
      this.replyRegisterStates.push(false);

      $lycaon.markdown.createViewer('#' + id, entity.comment, '100%');
    });

    this.replys.forEach((entity) => {
      var id = this.getReplyIdentity(entity);
      this.replyStates.push(false);

      $lycaon.markdown.createViewer('#' + id, entity.comment, '100%');
    });

    $lycaon.invalidEnterKey();

    this.$nextTick(() => {
      var self = this;
      $(window).on('load resize', () => {
        if (window.matchMedia('(max-width:480px)').matches) {
          if (self.sidebarCollapse === '') {
            self.toggleRightMenu();
          }
        } else if (window.matchMedia('(max-width:768px)').matches) {
          if (self.sidebarCollapse === '') {
            self.toggleRightMenu();
          }
        } else {
          if (self.sidebarCollapse !== '') {
            self.toggleRightMenu();
          }
        }
      });

      var id = expiringStorage.get(this.storageKey);
      if (id) {
        $('#' + id).addClass('show');
      } else {
        $('#menu-due-date').addClass('show');
      }

      $(`.sneeze-view a[href^="/${this.organization.handleId}/thread/"],
      .wapper-coment a[href^="/${this.organization.handleId}/thread/"],
      .tui-editor-contents a[href^="/${this.organization.handleId}/thread/`).each(async function () {
        var no = $(this).text().replace('#', '').trim();
        var regex = new RegExp('^[0-9]{1,8}');
        if (no.match(regex)) {
          $(this).attr('data-microtip-position', 'top');
          $(this).attr('data-microtip-size', 'medium');
          $(this).attr('role', 'tooltip');

          var cache = _.find(self.subjectCache, { no: Number(no) });
          if (cache) {
            $(this).attr('aria-label', cache.subject);
          } else {
            try {
              var response = await $lycaon.axios.get(`/api/v1/find/thread/${no}`, {});
              if (response && response.data) {
                self.subjectCache.push({
                  no: response.data.no,
                  subject: response.data.subject,
                });
                $(this).attr('aria-label', response.data.subject);
              }
            } catch (error) {
              console.log(error);
              self.subjectCache.push({ no: Number(no), subject: '' });
            }
          }
        }
      });

      //
    });
  },
  watch: {
    selectedDate: function (val) {
      if (val) {
        this.dueDate = $lycaon.formatter.formatDate(val);
      } else {
        this.dueDate = null;
      }
    },
    selectedMilestone: function (val) {
      if (val) {
        var milestone = _.find(this.milestone, (o) => {
          return o.id === val;
        });
        if (milestone && milestone.startAt && milestone.duration) {
          var start = moment(Number(milestone.startAt)).startOf('day').valueOf();
          var end = Number(start) + Number(milestone.duration);

          this.minDate = new Date(start);
          this.maxDate = new Date(end);

          return;
        }
      }

      this.minDate = undefined;
      this.maxDate = undefined;
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    toggleRightMenu: function () {
      if (this.sidebarCollapse === 'active') {
        this.sidebarCollapse = '';
      } else {
        this.sidebarCollapse = 'active';
      }
      if (this.rightSidebar === 'noactive') {
        this.rightSidebar = '';
      } else {
        this.rightSidebar = 'noactive';
      }
      if (this.mainContents === 'active') {
        this.mainContents = '';
      } else {
        this.mainContents = 'active';
      }
    },
    blockViewer: function (label) {
      this.viewerBlock = Vue.$loading.show(
        {
          container: this.$refs.loadingContainer,
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
    clickMenu: function (id) {
      expiringStorage.set(this.storageKey, id, 10);
      if (id === 'menu-jump') {
        this.jumpSelected = {};
      }
    },
    unSelectedClick: function () {
      this.selectedDate = '';
      this.dueDate = '';
    },
    chooseMe: function () {
      this.selectedResponsible = this.me.id;
    },
    onChangeTags: function () {},
    replyCollection: function (sneeze) {
      return _.where(this.replys, {
        sneeze: sneeze.id,
      });
    },
    checkCommentEditing: function () {
      if (this.openCommentIdentity) {
        var sneeze = _.find(this.sneezes, {
          id: this.openCommentIdentity,
        });
        $lycaon.jumpTo($('#' + this.getSneezeIdentity(sneeze)));
        $lycaon.infoToast('Editing comment [{0}] ...', [sneeze.serialNumber]);
        return false;
      }
      return true;
    },
    checkReplyRegisting: function () {
      if (this.currentSneeze) {
        $lycaon.jumpTo($('#' + this.getReplyRegisterIdentityWrapper(this.currentSneeze)));
        $lycaon.infoToast('Editing reply for comment [{0}] ...', [this.currentSneeze.serialNumber]);
        return false;
      }
      return true;
    },
    checkReplyEditing: function () {
      if (this.openReplyIdentity) {
        var reply = _.find(this.replys, {
          id: this.openReplyIdentity,
        });
        $lycaon.jumpTo($('#' + this.getSneezeReplyIdentity(reply)));
        $lycaon.infoToast('Editing reply [{0}] ...', [reply.serialNumber]);
        return false;
      }
      return true;
    },
    checkSubEditing: function () {
      if (!this.checkCommentEditing()) {
        return false;
      }
      if (!this.checkReplyEditing()) {
        return false;
      }
      if (!this.checkReplyRegisting()) {
        return false;
      }
      return true;
    },
    checkThreadEditing: function () {
      if (this.threadMode !== 'view') {
        $lycaon.scrollTop();
        $lycaon.infoToast('Editing thread ...');
        return false;
      }
      return true;
    },
    onEditClick: function () {
      $('.btn').tooltip('hide');

      if (!this.checkSubEditing()) {
        return;
      }

      this.threadMode = 'edit';
      $lycaon.socket.post('/ws/v1/thread-edit-in', { id: this.thread.id });

      var self = this;
      this.$nextTick(() => {
        var mode = 'vertical';
        if (window.matchMedia('(max-width:480px)').matches) {
          mode = 'tab';
        }
        self.threadEditor = $lycaon.markdown.createEditor(
          '#thread-editor',
          '600px',
          mode,
          i18next.t('Feel free to enter ...'),
          this.addImageBlobHook.bind(this)
        );
        $lycaon.markdown.addToolberImageList(self.threadEditor, () => {
          self.threadEditor.eventManager.emit('closeAllPopup');
          self.$refs.imagelist.load();
          self.showImageListModal = true;
        });

        self.threadEditor.mdEditor.setValue(self.thread.body);
        self.threadEditor.mdEditor.moveCursorToStart();

        $('html, body').stop().animate(
          {
            scrollTop: 0,
          },
          0,
          'easeOutQuart'
        );
        //$lycaon.scrollTop();
      });
    },
    onEditCancelClick: function () {
      $lycaon.socket.post('/ws/v1/thread-edit-out', { id: this.thread.id });
      this.threadMode = 'view';
    },
    onCommentEditClick: function (sneeze) {
      if (!this.checkThreadEditing()) {
        return;
      }
      if (!this.checkSubEditing()) {
        return;
      }

      this.openCommentIdentity = sneeze.id;
      this.$set(
        this.sneezeStates,
        _.findIndex(this.sneezes, {
          id: sneeze.id,
        }),
        true
      );

      var self = this;
      this.$nextTick(() => {
        $('#' + this.getCommentEditorIdentityWrapper(sneeze))
          .parents('.card-body')
          .addClass('edit-active');

        self.sneezeEditor = $lycaon.markdown.createEditor(
          '#' + this.getCommentEditorIdentity(sneeze),
          '300px',
          'tab',
          i18next.t('Feel free to enter your comments ...'),
          this.addImageBlobHook.bind(this)
        );
        self.sneezeEditor.mdEditor.setValue(sneeze.comment);
        self.sneezeEditor.mdEditor.moveCursorToStart();
        $lycaon.jumpTo($('#' + self.getSneezeIdentity(sneeze)));
      });
    },
    onCommentEditCancelClick: function (sneeze) {
      this.openCommentIdentity = null;
      var editorWrapper = this.getCommentEditorIdentityWrapper(sneeze);

      this.$set(
        this.sneezeStates,
        _.findIndex(this.sneezes, {
          id: sneeze.id,
        }),
        false
      );

      var self = this;
      this.$nextTick(() => {
        self.sneezeEditor.mdEditor.remove();
        self.sneezeEditor = {};
        $('#' + editorWrapper)
          .parents('.card-body')
          .removeClass('edit-active');
      });
    },
    onReplyRegisterClick: function (sneeze) {
      $('.btn').tooltip('hide');

      if (!this.checkThreadEditing()) {
        return;
      }
      if (!this.checkSubEditing()) {
        return;
      }

      this.currentSneeze = sneeze;
      this.$set(
        this.replyRegisterStates,
        _.findIndex(this.sneezes, {
          id: sneeze.id,
        }),
        true
      );

      var self = this;
      this.$nextTick(() => {
        $('#' + this.getReplyRegisterIdentityWrapper(sneeze)).addClass('edit-active');

        self.replyRegister = $lycaon.markdown.createEditor(
          '#' + this.getReplyRegisterIdentity(sneeze),
          '300px',
          'tab',
          i18next.t('Please write a reply to the comment ...'),
          this.addImageBlobHook.bind(this)
        );
        self.replyRegister.mdEditor.setValue('');
      });
    },
    onReplyRegisterCancelClick: function (sneeze) {
      this.currentSneeze = null;
      this.$set(
        this.replyRegisterStates,
        _.findIndex(this.sneezes, {
          id: sneeze.id,
        }),
        false
      );

      var self = this;
      this.$nextTick(() => {
        $('#' + this.getReplyRegisterIdentityWrapper(sneeze)).removeClass('edit-active');
        self.replyRegister.mdEditor.remove();
        self.replyRegister = {};
      });
    },
    onReplyEditClick: function (reply) {
      $('.btn').tooltip('hide');

      if (!this.checkThreadEditing()) {
        return;
      }
      if (!this.checkSubEditing()) {
        return;
      }

      this.openReplyIdentity = reply.id;
      this.$set(
        this.replyStates,
        _.findIndex(this.replys, {
          id: reply.id,
        }),
        true
      );

      var self = this;
      this.$nextTick(() => {
        $('#' + this.getReplyEditorIdentityWrapper(reply))
          .parents('.card-body')
          .addClass('edit-active');

        self.replyEditor = $lycaon.markdown.createEditor(
          '#' + this.getReplyEditorIdentity(reply),
          '300px',
          'tab',
          i18next.t('Please write a reply to the comment ...'),
          this.addImageBlobHook.bind(this)
        );
        self.replyEditor.mdEditor.setValue(reply.comment);
        self.replyEditor.mdEditor.moveCursorToStart();
        $lycaon.jumpTo($('#' + self.getSneezeReplyIdentity(reply)));
      });
    },
    onReplyEditCancelClick: function (reply) {
      this.openReplyIdentity = null;
      this.$set(
        this.replyStates,
        _.findIndex(this.replys, {
          id: reply.id,
        }),
        false
      );

      var self = this;
      this.$nextTick(() => {
        self.replyEditor.mdEditor.remove();
        self.replyEditor = {};
        $('#' + this.getReplyEditorIdentityWrapper(reply))
          .parents('.card-body')
          .removeClass('edit-active');
      });
    },
    showSneezeView: function (sneeze) {
      var index = _.findIndex(this.sneezes, {
        id: sneeze.id,
      });
      return !this.sneezeStates[index];
    },
    showSneezeEditor: function (sneeze) {
      var index = _.findIndex(this.sneezes, {
        id: sneeze.id,
      });
      return this.sneezeStates[index];
    },
    showReplyView: function (reply) {
      var index = _.findIndex(this.replys, {
        id: reply.id,
      });
      return !this.replyStates[index];
    },
    showReplyEditor: function (reply) {
      var index = _.findIndex(this.replys, {
        id: reply.id,
      });
      return this.replyStates[index];
    },
    showReplyRegister: function (sneeze) {
      var index = _.findIndex(this.sneezes, {
        id: sneeze.id,
      });
      return this.replyRegisterStates[index];
    },
    isCreateThread: function (type) {
      return type === 'create';
    },
    isUpdateThread: function (type) {
      return type === 'update' && this.viewActivity !== 1;
    },
    isLocal: function (type) {
      return type === 'local' && this.viewActivity !== 1;
    },
    isUpdateConcept: function (type) {
      return type === 'update-concept' && this.viewActivity !== 1;
    },
    isUpdateStatus: function (type) {
      return type === 'update-status' && this.viewActivity !== 1;
    },
    isUpdateDuedate: function (type) {
      return type === 'update-duedate' && this.viewActivity !== 1;
    },
    isUpdatePriority: function (type) {
      return type === 'update-priority' && this.viewActivity !== 1;
    },
    isUpdateLock: function (type) {
      return type === 'update-lock' && this.viewActivity !== 1;
    },
    isUpdateWorking: function (type) {
      return type === 'update-working' && this.viewActivity !== 1;
    },
    isUpdateCategory: function (type) {
      return type === 'update-category' && this.viewActivity !== 1;
    },
    isResponsible: function (type) {
      return type === 'responsible' && this.viewActivity !== 1;
    },
    isCreateSneeze: function (type) {
      return type === 'create-sneeze';
    },
    isUpdateSneeze: function (type) {
      return type === 'update-sneeze' && this.viewActivity !== 1;
    },
    isCreateReply: function (type) {
      return type === 'create-reply';
    },
    isUpdateReply: function (type) {
      return type === 'update-reply' && this.viewActivity !== 1;
    },
    isAttachFile: function (type) {
      return type === 'attach-file' && this.viewActivity !== 1;
    },
    isDeleteFile: function (type) {
      return type === 'delete-file' && this.viewActivity !== 1;
    },
    isMilestone: function (type) {
      return type === 'milestone' && this.viewActivity !== 1;
    },
    isRelationship: function (type) {
      return type === 'relationship' && this.viewActivity !== 1;
    },
    isDeleteRelationship: function (type) {
      return type === 'delete-relationship' && this.viewActivity !== 1;
    },
    isFork: function (type) {
      return type === 'fork' && this.viewActivity !== 1;
    },
    getSneezeIdentity: function (sneeze) {
      return 'sneeze-' + String(sneeze.serialNumber);
    },
    getCommentIdentity: function (sneeze) {
      return 'comment-' + String(sneeze.serialNumber);
    },
    sneezeAnker: function (sneeze) {
      return `/${this.organization.handleId}/thread/${this.thread.no}#${this.getSneezeIdentity(sneeze)}`;
    },
    replyAnker: function (reply) {
      return `/${this.organization.handleId}/thread/${this.thread.no}#${this.getSneezeReplyIdentity(reply)}`;
    },
    getCommentEditorIdentity: function (sneeze) {
      return 'comment-editor-' + String(sneeze.serialNumber);
    },
    getCommentEditorIdentityWrapper: function (sneeze) {
      return 'wrapper-comment-editor-' + String(sneeze.serialNumber);
    },
    getReplyRegisterIdentity: function (sneeze) {
      return 'sneeze-reply-register-' + String(sneeze.serialNumber);
    },
    getReplyRegisterIdentityWrapper: function (sneeze) {
      return 'wrapper-sneeze-reply-register-' + String(sneeze.serialNumber);
    },
    getSneezeReplyIdentity: function (reply) {
      return 'sneeze-' + String(reply.parentSerialNumber) + '-reply-' + String(reply.serialNumber);
    },
    getReplyIdentity: function (reply) {
      return 'sneeze-' + String(reply.parentSerialNumber) + '-reply-view-' + String(reply.serialNumber);
    },
    getReplyEditorIdentity: function (reply) {
      return 'sneeze-' + String(reply.parentSerialNumber) + '-reply-editor-' + String(reply.serialNumber);
    },
    getReplyEditorIdentityWrapper: function (reply) {
      return 'sneeze-' + String(reply.parentSerialNumber) + '-wrapper-reply-editor-' + String(reply.serialNumber);
    },
    parseUserId: function (user) {
      return 'member-' + user.id;
    },
    blockEditor: function (label) {
      this.viewerBlock = Vue.$loading.show(
        {
          container: this.$refs.threadEditor,
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
          `/api/v1/appendix/thread/${this.thread.id}`,
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

        self.isUploading = false;
        if (_.isFunction(callback)) {
          self.hideBlock();
        }

        if (response.data.status === 'error') {
          if (response.data.error === 'maxQuota') {
            $lycaon.infoKeepToast(
              'The current plan does not allow the entire organization to attach any more files. A storage limit has occurred. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxSizePerThread') {
            $lycaon.infoKeepToast(
              'The current plan does not allow you to attach any more files to this thread. The thread attachment size limit has been reached. Please consider updating your usage plan'
            );
          } else if (response.data.error === 'maxFilePerThread') {
            $lycaon.infoKeepToast(
              'The current plan does not allow you to attach any more files to this thread. You have reached the thread attachment limit. Please consider updating your usage plan'
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
        await $lycaon.axios.delete(`/api/v1/appendix/thread/${this.thread.id}/${item.id}`, {});
        this.appendix.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    },
    downloadAppendix: function (item) {
      return `/download/thread/${this.thread.id}/${item.id}`;
    },
    deleteParent: function (item) {
      this.parentSelected = item;
      this.showDeleteParentModal = true;
    },
    onDeleteParent: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-parent-form')[0],
      });
      form.submit();
    },
    deleteChild: function (item) {
      this.childSelected = item;
      this.showDeleteChildModal = true;
    },
    onDeleteChild: function () {
      var form = _.find(this.$children, {
        $el: $('#delete-child-form')[0],
      });
      form.submit();
    },
    jumpToSneeze: function (sneeze) {
      $lycaon.jumpTo($('#' + this.getSneezeIdentity(sneeze)));
      return false;
    },
    jumpToReply: function (reply) {
      $lycaon.jumpTo($('#' + this.getSneezeReplyIdentity(reply)));
      return false;
    },
    jumpToCommentEditor: function () {
      $lycaon.jumpTo($('#comment-editor'));
      this.commentEditor.focus();
      return false;
    },
    onNewThreadCkick: function () {
      location.href = `/${this.organization.handleId}/thread/create/${this.team.id}`;
    },
    onForkCkick: function () {
      location.href = `/${this.organization.handleId}/thread/create/${this.team.id}/${this.thread.id}`;
    },
    onConvertToWikiCkick: function () {
      location.href = `/${this.organization.handleId}/wiki/convert/${this.thread.no}`;
    },
    chiledLinks: function (item) {
      return `/${this.organization.handleId}/thread/${item.no}`;
    },
    reload: function () {
      this.reloaded = true;
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/thread/${this.thread.no}`;
    },
    setRefsUpdate: function (b) {
      this.showRefsUpdateModal = false;
      if (b) {
        this.refsUpdate = 1;
      } else {
        this.refsUpdate = 2;
      }
      var form = _.find(this.$children, {
        $el: $('#form-update-thraed')[0],
      });
      form.submit();
    },
    submittedForm: async function () {
      this.reload();
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      if (this.hasRefs && this.refsUpdate === 0 && this.milestone.length > 0) {
        if (!this.thread.milestone && Number(this.selectedMilestone)) {
          this.showRefsUpdateModal = true;
          return;
        }
        if (this.thread.milestone && Number(this.selectedMilestone) !== this.thread.milestone.id) {
          this.showRefsUpdateModal = true;
          return;
        }
      }

      var argins = {
        id: this.thread.id,
        subject: this.thread.subject,
        body: this.threadEditor.mdEditor.getValue(),
        local: this.local,
        concept: this.thread.concept,
        category: this.thread.category.id,
        refsUpdate: this.refsUpdate,
      };

      if (Number(this.selectedResponsible) > 0) {
        argins.responsible = Number(this.selectedResponsible);
      }
      if (Number(this.selectedMilestone) > 0) {
        argins.milestone = Number(this.selectedMilestone);
      }

      // Validate
      if (!argins.subject) {
        this.formErrors.subject = true;
      }

      if (argins.body && new TextEncoder().encode(argins.body).length >= 107374180) {
        this.formErrors.bodyLength = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      argins.tags = this.selectedTags;

      return argins;
    },
    submittedStatusForm: async function () {
      this.reload();
    },
    handleParsingStatusForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        status: this.status === 0 ? 1 : 0,
      };
      return argins;
    },
    submittedFlagForm: async function () {
      this.reload();
    },
    handleParsingFlagForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        state: !this.isFan,
      };
      return argins;
    },
    submittedDuedateForm: async function () {
      this.reload();
    },
    handleParsingDuedateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        dueDate: moment(this.selectedDate).valueOf(),
      };
      return argins;
    },
    submittedResponsibleForm: async function () {
      this.reload();
    },
    handleParsingResponsibleForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
      };
      if (this.responsible) {
        argins.responsible = this.responsible;
      }

      return argins;
    },
    submittedPriorityForm: async function () {
      this.reload();
    },
    handleParsingPriorityForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        priority: this.priority,
      };
      return argins;
    },
    submittedLockForm: async function () {
      this.reload();
    },
    handleParsingLockForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        locked: !this.thread.locked,
      };
      return argins;
    },
    submittedWorkingForm: async function () {
      this.reload();
    },
    handleParsingWorkingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        working: !this.thread.working,
      };
      return argins;
    },
    submittedConceptForm: async function () {
      this.reload();
    },
    handleParsingConceptForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.thread.id,
        concept: this.thread.concept === 0 ? 1 : 0,
      };
      return argins;
    },
    submittedSneezeUpdateForm: async function () {
      this.reload();
    },
    handleParsingSneezeUpdateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.openCommentIdentity,
        comment: this.sneezeEditor.mdEditor.getValue(),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      } else {
        if (new TextEncoder().encode(argins.comment).length >= 107374180) {
          this.formErrors.sneezeLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    submittedSneezeCreateForm: async function () {
      this.reload();
    },
    handleParsingSneezeCreateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        thread: this.thread.id,
        comment: this.commentEditor.mdEditor.getValue(),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      } else {
        if (new TextEncoder().encode(argins.comment).length >= 107374180) {
          this.formErrors.commentLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    submittedReplyUpdateForm: async function () {
      this.reload();
    },
    handleParsingReplyUpdateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        id: this.openReplyIdentity,
        comment: this.replyEditor.mdEditor.getValue(),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      } else {
        if (new TextEncoder().encode(argins.comment).length >= 107374180) {
          this.formErrors.replyLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    submittedReplyCreateForm: async function () {
      this.reload();
    },
    handleParsingReplyCreateForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        sneeze: this.currentSneeze.id,
        comment: this.replyRegister.mdEditor.getValue(),
      };

      // Validate
      if (!argins.comment || argins.comment === '') {
        this.formErrors.comment = true;
      } else {
        if (new TextEncoder().encode(argins.comment).length >= 107374180) {
          this.formErrors.replyLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter a comment');
        return;
      }

      return argins;
    },
    submittedParentForm: async function () {
      this.reload();
    },
    handleParsingParentForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      // Validate
      if (!this.parentSelected || !this.parentSelected.id) {
        this.formErrors.parent = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Please enter the ID of the parent thread to be set');
        return;
      }

      var argins = {
        thread: this.thread.id,
        parent: this.parentSelected.id,
      };
      return argins;
    },
    submittedChildForm: async function () {
      this.reload();
    },
    handleParsingChildForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      // Validate
      if (!this.childSelected || !this.childSelected.id) {
        this.formErrors.child = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('Set the ID of the thread to which you want to add the association');
        return;
      }

      var argins = {
        thread: this.thread.id,
        child: this.childSelected.id,
      };
      return argins;
    },
    submittedDeleteChildForm: async function () {
      this.reload();
    },
    handleParsingDeleteChildForm: function () {
      this.showDeleteChildModal = false;
      var argins = {
        thread: this.thread.id,
        child: this.childSelected.id,
      };
      return argins;
    },
    submittedDeleteParentForm: async function () {
      this.reload();
    },
    handleParsingDeleteParentForm: function () {
      this.showDeleteParentModal = false;
      var argins = {
        thread: this.thread.id,
      };
      return argins;
    },
    updateStatusSubmit: function () {
      var form = _.find(this.$children, {
        $el: $('#status-update-form')[0],
      });
      form.submit();
    },
    updateFlagSubmit: function () {
      var form = _.find(this.$children, {
        $el: $('#flag-update-form')[0],
      });
      form.submit();
    },
    parentSelectedEvent: function (option) {
      this.parentSelected = option;
    },
    childSelectedEvent: function (option) {
      this.childSelected = option;
    },
    jumpSelectedEvent: function (option) {
      if (!option || !option.no) {
        return;
      }
      this.jumpSelected = option;
      location.href = `/${this.organization.handleId}/thread/${option.no}`;
    },
    showAllMember: function () {
      this.allMembers = [];
      this.membersPage = 1;
      var form = _.find(this.$children, {
        $el: $('#query-member-form')[0],
      });
      form.submit();
      this.showMemberModal = true;
    },
    hideMembers: function () {
      this.allMembers = [];
      this.membersPage = 1;
      this.showMemberModal = false;
    },
    submittedMemberForm: function (response) {
      if (!response.members) {
        console.log('data not found!');
        return;
      }

      if (response.members.length) {
        this.membersPage += 1;
        this.allMembers.push(...response.members);
        if (this.memberInfiniteState) {
          this.memberInfiniteState.loaded();
        }
      } else {
        if (this.memberInfiniteState) {
          this.memberInfiniteState.complete();
        }
      }
      this.cloudSuccess = true;
    },
    handleParsingMemberForm: function () {
      var argins = { id: this.team.id, page: this.membersPage };
      return argins;
    },
    allMemberHandler($state) {
      this.memberInfiniteState = $state;
      var form = _.find(this.$children, {
        $el: $('#query-member-form')[0],
      });
      form.submit();
    },
    tagLink: function (tag) {
      return `/${this.organization.handleId}/team/${this.team.id}/thread/${tag.id}`;
    },
    isActivityOpen: function (item) {
      return item.stateWord === 'open';
    },
    activityCloseCss: function (item) {
      if (item.stateWord === 'open') {
        return 'icon-yellow';
      } else {
        return 'icon-red';
      }
    },
    showEmotionsRadar: function () {
      var emos = this.thread.emotional;
      if (emos) {
        var config = {
          type: 'radar',
          data: {
            labels: [
              i18next.t('anger'),
              i18next.t('fear'),
              i18next.t('happy'),
              i18next.t('hatred'),
              i18next.t('sad'),
              i18next.t('shame'),
              i18next.t('surprise'),
            ],
            datasets: [
              {
                data: [
                  emos.anger.score,
                  emos.fear.score,
                  emos.happy.score,
                  emos.hatred.score,
                  emos.sad.score,
                  emos.shame.score,
                  emos.surprise.score,
                ],
              },
            ],
          },
          options: {
            scale: {
              ticks: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
                position: 'top',
              },
              title: {
                display: false,
                text: 'Emotions Radar Chart',
              },
              colorschemes: {
                scheme: 'tableau.Orange20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        };

        this.showEmotionsModal = true;
        this.$nextTick(() => {
          new Chart(document.getElementById('emotions-radar'), config);
        });
      }
    },
    translator: function (val) {
      return this.i18n('Opened at {0}', [val]);
    },
    commentTranslator: function (val) {
      return this.i18n('Commented at {0}', [val]);
    },
    replyTranslator: function (val) {
      return this.i18n('Replied at {0}', [val]);
    },
    localTranslator: function (val) {
      return this.i18n('Changed the thread to [ private ] at {0}', [val]);
    },
    conceptTranslator: function (val, option) {
      return this.i18n('Changed the concept to [ {0} ] at {1}', [this.i18n(option.stateWord), val]);
    },
    statusTranslator: function (val, option) {
      return this.i18n('Changed the status to [ {0} ] at {1}', [this.i18n(option.stateWord), val]);
    },
    duedateTranslator: function (val, option) {
      return option.targetDate
        ? this.i18n('Changed the deadline to [ {0} ] at {1}', [this.formatDate(option.targetDate), val])
        : this.i18n('Changed the deadline to [ No setting ] at {0}', [val]);
    },
    priorityTranslator: function (val, option) {
      return this.i18n('Changed importance to [ {0} ] at {1}', [this.i18n(option.stateWord), val]);
    },
    lockTranslator: function (val, option) {
      return this.i18n('Changed the thread to [ {0} ] at {1}', [this.i18n(option.stateWord), val]);
    },
    workingTranslator: function (val, option) {
      return this.i18n('Changed the thread to [ {0} ] at {1}', [this.i18n(option.stateWord), val]);
    },
    categoryTranslator: function (val, option) {
      return this.i18n('Changed the category to [ {0} ] at {1}', [option.stateWord, val]);
    },
    responsibleTranslator: function (val, option) {
      return option.userName
        ? this.i18n('Changed the person in charge to [ {0} ] at {1}', [option.userName, val])
        : this.i18n('Changed the person in charge to [ No setting ] at {0}', [val]);
    },
    updateTranslator: function (val) {
      return this.i18n('Updated the thread at {0}', [val]);
    },
    attachTranslator: function (val, option) {
      return this.i18n('Attached file [{0}] at {1}', [option.fileName, val]);
    },
    detachTranslator: function (val, option) {
      return this.i18n('Deleted file [{0}] at {1}', [option.fileName, val]);
    },
    createReplyTranslator: function (val) {
      return this.i18n('Created a reply at {0}', [val]);
    },
    updateReplyTranslator: function (val) {
      return this.i18n('Updated the reply at {0}', [val]);
    },
    createSneezTranslator: function (val) {
      return this.i18n('Created a comment at {0}', [val]);
    },
    updateSneezTranslator: function (val) {
      return this.i18n('Updated the comment at {0}', [val]);
    },
    milestoneTranslator: function (val) {
      return this.i18n('Milestones have been set at {0}', [val]);
    },
    relationshipTranslator: function (val, option) {
      return this.i18n('The associated thread has been set [{0}] at {1}', [option.stateWord, val]);
    },
    deleteRelationshipTranslator: function (val, option) {
      return this.i18n('The related thread has been released [{0}] at {1}', [option.stateWord, val]);
    },
    forkTranslator: function (val, option) {
      return this.i18n('A fork for this thread has been created [{0}] at {1}', [option.stateWord, val]);
    },
    copyNo: function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.thread.no).then(this.notifyCopy);
      } else {
        var tmp = document.createElement('div');
        var pre = document.createElement('pre');

        pre.style.webkitUserSelect = 'auto';
        pre.style.userSelect = 'auto';
        tmp.appendChild(pre).textContent = this.thread.no;

        var s = tmp.style;
        s.position = 'fixed';
        s.right = '200%';

        document.body.appendChild(tmp);
        document.getSelection().selectAllChildren(tmp);
        document.execCommand('copy');

        document.body.removeChild(tmp);

        this.notifyCopy();
      }
    },
    notifyCopy: function () {
      this.clipperMessage = i18next.t('Copy completed');
      var self = this;
      setTimeout(() => {
        self.role = '';
        setTimeout(() => {
          self.clipperMessage = i18next.t('Copy thread No');
          self.role = 'tooltip';
        }, 1000);
      }, 1000);
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
    displayStatus: function () {
      if (this.status === 0) {
        return this.i18n('open');
      }
      return this.i18n('close');
    },
    displayStatusIcon: function () {
      if (this.status === 0) {
        return 'fas fa-exclamation-circle';
      }
      return 'fas fa-check-circle';
    },
    displayStatusClass: function () {
      if (this.status === 0) {
        return 'badge badge-pill badge-warning';
      }
      return 'badge badge-pill badge-dark';
    },
    milestoneLink: function () {
      return `/${this.organization.handleId}/milestone/${this.team.id}`;
    },
    teamLink: function () {
      if (this.query) {
        return (
          `/${this.organization.handleId}/team/${this.team.id}?query=` + encodeURIComponent(JSON.stringify(this.query))
        );
      }
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
    forkLink: function () {
      return `/${this.organization.handleId}/thread/${this.fork.no}`;
    },
    select2Url: function () {
      return `/api/v1/thread/find/${this.team.id}/${this.thread.id}`;
    },
    select2placeholder: function () {
      return i18next.t('Enter thread No');
    },
    select2placeholderForJump: function () {
      return i18next.t('Enter Thread No of jump');
    },
    select2Settings: function () {
      return {
        width: '100%',
        dropdownAutoWidth: true,
      };
    },
    calendar: function () {
      return [
        {
          key: 'today',
          highlight: {
            color: 'indigo', // gray, red, orange, yellow, green, teal, blue, indigo, purple, pink.
            fillMode: 'light',
          },
          dates: new Date(),
          popover: {
            label: i18next.t('today'),
          },
        },
      ];
    },
    calendarMasks: function () {
      if (this.language === 'ja') {
        return { title: 'YYYY年M月', dayPopover: 'YYYY年M月D日(WWW) ' };
      }
      return { title: 'YYYY/MM', dayPopover: 'YYYY/MM/DD (WWW) ' };
    },
    progressStyle: function () {
      var width = this.thread.priority ? this.thread.priority : 0;
      return `width: ${width}%`;
    },
    isProtected: function () {
      if (!this.thread.owner) {
        return false;
      }
      return (
        (this.thread.local && this.thread.owner.id !== this.me.id) ||
        (this.thread.concept === 0 && this.thread.owner.id !== this.me.id) ||
        this.thread.locked
      );
    },
    priorityWord: function () {
      if (this.thread.priority === 0) {
        return i18next.t('Low');
      } else if (this.thread.priority === 1) {
        return i18next.t('Normally');
      } else {
        return i18next.t('High');
      }
    },
    urgencyRate: function () {
      var val = Math.round((this.thread.urgency / 6) * 100);
      return `width: ${val}%`;
    },
    storageKey: function () {
      return `lycaon-right-side-menu.cache.${window.location.host}`;
    },
    infiniteId: function () {
      return new Date();
    },
    tagTooltip: function () {
      return this.i18n('Search for the same tag');
    },
    hasRefs: function () {
      return this.fork || this.children.length > 0;
    },
    mindmapLink: function () {
      return `/${this.organization.handleId}/mindmap/${this.thread.no}`;
    },
    commentArrived: function () {
      return this.i18n('a comment has arrived');
    },
    myTeams: function () {
      return this.me.teams;
    },
  },
});
