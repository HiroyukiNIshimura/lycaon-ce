parasails.registerPage('wiki', {
  mixins: [messageNotify],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    viewer: {},
    appendix: [],
    isWikiEditDisabled: '',
    conflictUser: {},
    showCloseWikiModal: false,
    flagColor: '',
    isFan: false,
    showToc: true,
    showPrevious: false,
    previuosDiff: '',
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
    this.appendix = _.clone(this.wiki.items);

    if (this.wiki.flags.length > 0) {
      this.isFan = true;
      this.flagColor = this.wiki.flags[0].color;
    }
  },
  mounted: async function () {
    var self = this;
    window.addEventListener('beforeunload', () => {
      $lycaon.socket.post('/ws/v1/wiki-out', { id: self.wiki.id });
    });

    //https://nhn.github.io/tui.editor
    this.viewer = $lycaon.markdown.createViewer('#viewer', this.wiki.body, '100%');

    $lycaon.socket.post('/ws/v1/wiki-in', { id: self.wiki.id }, () => {
      //
      io.socket.on('wiki-edit-in', (data) => {
        if (data.queryUser && data.queryUser.id === self.me.id) {
          $lycaon.socketToast(data.message);
          self.isWikiEditDisabled = 'disabled';
          self.conflictUser = data.user;
        } else if (!data.queryUser && data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
          self.isWikiEditDisabled = 'disabled';
          self.conflictUser = data.user;
        }
      });
      io.socket.on('wiki-edit-out', (data) => {
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
          self.isWikiEditDisabled = '';
          self.conflictUser = {};
        }
      });
      io.socket.on('wiki-update', (data) => {
        if (data.user.id !== self.me.id && self.wiki.id === data.wiki.id) {
          $lycaon.infoKeepToast(data.message.key, data.message.params);
          self.wiki = Object.assign({}, self.wiki, {
            subject: data.wiki.subject,
            body: data.wiki.body,
          });
          self.viewer.setMarkdown(data.wiki.body);
        }
      });
    });

    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
    if (this.errorMessage) {
      $lycaon.cloudErrorToast(this.errorMessage);
    }

    this.buildToc();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    buildToc: function () {
      this.showToc = true;
      this.$nextTick(() => {
        $('#wiki-toc').toc({ content: 'div.container', headings: 'h1,h2,h3' });
        var nodes = $('#wiki-toc').find('a');
        if (nodes.length < 1) {
          this.showToc = false;
        } else {
          $(window).scroll(() => {
            $('h1,h2,h3').each(() => {
              if (document.documentElement.scrollTop >= this.offsetTop) {
                var id = this.getAttribute('id');
                nodes.removeClass('toc-active');
                var active = $('#wiki-toc').find('a[href="#' + id + '"]');
                active.addClass('toc-active');
              }
            });
          });
        }
      });
    },
    fileLinksTarget: function (item) {
      if (item.mimeType.startsWith('application')) {
        return '';
      }
      return '_blank';
    },
    closeWiki: function () {
      this.showCloseWikiModal = true;
    },
    doCloseWiki: function () {
      var form = _.find(this.$children, {
        $el: $('#close-wiki-form')[0],
      });
      form.submit();
    },
    submittedForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/team/${this.team.id}`;
    },
    handleParsingForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      this.showCloseWikiModal = false;

      var argins = {
        id: this.wiki.id,
      };
      return argins;
    },
    ckickUpdateFlag: function (color) {
      var form = _.find(this.$children, {
        $el: $('#flag-wiki-form')[0],
      });
      this.flagColor = color;
      form.submit();
    },
    submittedFlagForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    handleParsingFlagForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      var argins = {
        id: this.wiki.id,
        state: !this.isFan,
        flagColor: this.flagColor,
      };
      return argins;
    },
    clickUpdateVote: function () {
      var form = _.find(this.$children, {
        $el: $('#vote-wiki-form')[0],
      });
      form.submit();
    },
    submittedVoteForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    handleParsingVoteForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();
      var argins = {
        id: this.wiki.id,
        vote: 1,
      };
      return argins;
    },
    tagLink: function (tag) {
      return `/${this.organization.handleId}/team/${this.team.id}/wiki?tag=${tag.id}`;
    },
    downloadAppendix: function (item) {
      return `/download/wiki/${this.wiki.id}/${item.id}`;
    },
    translator: function (val) {
      return this.i18n('Posted at {0}', [val]);
    },
    buildPrevious: function () {
      if (this.wiki.previous) {
        this.previuosDiff = $lycaon.parsePrevious(this.wiki.previous);
        this.showPrevious = true;
      }
    },
  },
  computed: {
    returnLink: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
    editLink: function () {
      return `/${this.organization.handleId}/wiki/edit/${this.wiki.no}`;
    },
    bottomBtnShow: function () {
      return [...this.wiki.body].length > 1000;
    },
    niceCount: function () {
      return this.wiki.nice ? this.wiki.nice : 0;
    },
    downloadLink: function () {
      return `/api/v1/wiki/pdf/${this.wiki.id}`;
    },
    tagTooltip: function () {
      return this.i18n('Search for the same tag');
    },
    flagColorStyle: function () {
      return `color: ${this.flagColor}`;
    },
  },
});
