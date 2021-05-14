parasails.registerPage('pubdoc-page', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    viewer: {},
    appendix: [],
    showToc: true,
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
  },
  mounted: async function () {
    //https://nhn.github.io/tui.editor
    this.viewer = $lycaon.markdown.createViewer('#viewer', this.wiki.body, '100%');

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
          $(window).scroll(function () {
            $('h1,h2,h3').each(function () {
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
    translator: function (val) {
      return this.i18n('Posted at {0}', [val]);
    },
  },
  computed: {
    downloadLink: function () {
      return `/api/v1/wiki/pdf/${this.wiki.id}`;
    },
  },
});
