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
      tooltip: '',
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span ref="clipper" data-toggle="tooltip" :title="i18n('Copy Markdown to clipboard')">
    <a ref="clipperAction" class="text-info" href="javascript:void(0)" @click="copy"><i class="far fa-clipboard"></i></a>
</span>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {},
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    copy: function () {
      $(this.$refs.clipper).tooltip('hide');

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
      var $action = $(this.$refs.clipperAction);
      $action.attr('title', i18next.t('Copy completed'));
      $action.tooltip('show');
      setTimeout(function () {
        $action.removeAttr('title');
        $action.tooltip('dispose');
      }, 1000);
    },
  },
  computed: {},
});
