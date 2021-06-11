/**
 * <clipboard>
 * -----------------------------------------------------------------------------
 * loading progress
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('clipboard', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['data'],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      message: '',
      role: 'tooltip',
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span ref="clipper" :aria-label="message" data-microtip-position="bottom" data-microtip-size="medium" :role="role">
  <a ref="clipperAction" class="text-info" href="javascript:void(0)" @click="copy"><i class="far fa-clipboard"></i></a>
</span>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.message = i18next.t('Copy Markdown to clipboard');
  },
  mounted: async function () {},
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    copy: function () {
      if (!this.data) {
        return;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.data).then(this.notifyCopy);
      } else {
        var tmp = document.createElement('div');
        var pre = document.createElement('pre');

        pre.style.webkitUserSelect = 'auto';
        pre.style.userSelect = 'auto';
        tmp.appendChild(pre).textContent = this.data;

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
      this.message = i18next.t('Copy completed');
      var self = this;
      setTimeout(function () {
        self.role = '';
        setTimeout(function () {
          self.message = i18next.t('Copy Markdown to clipboard');
          self.role = 'tooltip';
        }, 1000);
      }, 1000);
    },
  },
  computed: {},
});
