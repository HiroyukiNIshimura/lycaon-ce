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
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {};
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span class="ml-1" v-if="user">
  <img :class="sizeClass" :src="user.gravatarUrl" v-if="user.avatarType === 'gravatar'" />
  <img
      class="rounded-circle"
      :class="sizeClass"
      :src="user.avatarVirtualUrl"
      v-else-if="user.avatarType === 'user-avatar'"
  />
  <svg :class="sizeClass" :data-jdenticon-value="user.emailAddress" v-else></svg>
  <a :id="parseUserId" class="ml-1 comment-tip" :href="menberInfoLink" v-if="showUserName == true">{{ user.fullName }}</a>
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
  },
  mounted: async function () {
    jdenticon();
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
      return 'member-' + this.user.id;
    },
    menberInfoLink: function () {
      return `/${this.organization.handleId}/member/${this.user.id}`;
    },
  },
});
