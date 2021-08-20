/**
 * <user-identity>
 * -----------------------------------------------------------------------------
 * user identity component
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('userIdentity', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    size: { default: 'sm' },
    showUserName: { default: true },
    user: {},
    organization: {},
    id: '',
    avaterId: '',
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      uuid: '',
      me: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span class="ml-1" v-if="user">
  <span :id="parseAvaterId" class="user-avater-icon">
    <img :class="sizeClass" :src="user.gravatarUrl" v-if="user.avatarType === 'gravatar'" />
    <img class="rounded-circle" :class="sizeClass" :src="user.avatarVirtualUrl"
      v-else-if="user.avatarType === 'user-avatar'" />
    <svg :class="sizeClass" :data-jdenticon-value="user.emailAddress" v-else></svg>
  </span>
  <a :id="parseUserId" class="ml-1 comment-tip" :href="menberInfoLink"
    v-if="showUserName == true">{{ user.fullName }}</a>
</span>
<span class="ml-1" v-else>
  {{ i18n('Anonymous account') }}
</span>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
    var dt = new Date();
    this.uuid = `${this.user.id}-${dt.valueOf()}`;
    this.me = SAILS_LOCALS.me;
  },
  mounted: async function () {
    jdenticon();

    this.$nextTick(() => {
      var self = this;

      var $avater = $('#' + this.parseAvaterId);

      if (this.me && this.me.id === this.user.id && this.me.teams && this.me.teams.length > 0) {
        $avater.popover({
          placement: 'bottom',
          html: true,
          trigger: 'click',
          title: self.i18n('Move to selected team'),
          content: function () {
            var html = '';
            _.each(self.me.teams, (o) => {
              var href = `/${self.organization.handleId}/team/${o.id}`;
              html += `<div><a href="${href}">${o.name}</a></div>`;
            });
            return html;
          },
        });
      } else {
        $avater.popover({
          placement: 'bottom',
          html: true,
          trigger: 'click',
          content: function () {
            var href = `/${self.organization.handleId}/member/${self.user.id}?tab=tab-message`;
            var html = `<div><a href="${href}"><i class="far fa-comment-dots"></i> ${self.i18n(
              'Send a message'
            )}</a></div>`;
            return html;
          },
        });
      }
      $avater.on('shown.bs.popover', () => {
        $('.user-avater-icon').not($avater).popover('hide');
      });
    });
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {},
  computed: {
    sizeClass: function () {
      if (this.size === 'sm') {
        return 'user-icon-sm';
      }
      return 'user-icon';
    },
    parseUserId: function () {
      if (this.id) {
        return this.id;
      }
      return 'member-' + this.uuid;
    },
    parseAvaterId: function () {
      if (this.avaterId) {
        return this.avaterId;
      }
      return 'member-avater-' + this.uuid;
    },
    menberInfoLink: function () {
      return `/${this.organization.handleId}/member/${this.user.id}`;
    },
  },
});
