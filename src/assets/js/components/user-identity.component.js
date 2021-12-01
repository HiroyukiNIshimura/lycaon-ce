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
    popStatus: '',
    thread: {},
    isPopIcon: false,
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      uuid: '',
      me: {},
      showPoporver: false,
      myPop: false,
      yourPop: false,
      isThread: false,
    };
  },
  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span class="ml-1" v-if="user">
  <span :id="parseAvaterId" class="user-avater-icon" @click="onIconClick" ref="userIdentity">
    <img :class="sizeClass" :src="user.gravatarUrl" v-if="user.avatarType === 'gravatar'" />
    <img class="rounded-circle" :class="sizeClass" :src="user.avatarVirtualUrl" v-else-if="user.avatarType === 'user-avatar'" />
    <svg :class="sizeClass" :data-jdenticon-value="user.emailAddress" v-else></svg>
  </span>
  <a :id="parseUserId" class="ml-1 comment-tip" :href="menberInfoLink" v-if="showUserName == true">
    {{ user.fullName }}</a>

  <div class="v-popover fade v-bs-popover-right show" x-placement="bottom" style="width:15rem" :style="transform" v-if="myPop && showPoporver">
    <div class="v-arrow"></div>
    <h3 class="v-popover-header">{{ i18n('Move to selected team') }}</h3>
    <div class="v-popover-body">
      <div v-for="team in me.teams"><a :href="teamLink(team)">{{ team.name }}</a></div>
    </div>
  </div>
  <div class="v-popover fade v-bs-popover-right show" x-placement="bottom" style="width:10rem" :style="transform" v-if="yourPop && showPoporver">
    <div class="v-arrow"></div>
    <h3 class="v-popover-header"></h3>
    <div class="v-popover-body">
      <div>
        <div><a :href="messageLink"><i class="far fa-comment-dots"></i> {{ i18n('Send a message') }}</a></div>
        <div v-if="isThread">
          <a href="#" @click.prevent="sendPleaseRead"><i class="fab fa-readme"></i> {{ i18n('Please read!') }}</a>
        </div>
      </div>
    </div>
  </div>
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

    if (this.me && this.me.id === this.user.id && this.me.teams && this.me.teams.length > 0) {
      this.myPop = true;
      this.yourPop = false;
    } else {
      this.myPop = false;
      this.yourPop = true;
    }

    if (this.thread) {
      this.isThread = true;
    }
  },
  mounted: async function () {
    jdenticon();
  },
  beforeDestroy: function () {
    //…
  },

  watch: {
    popStatus: function (val) {
      if (this.uuid !== val) {
        this.showPoporver = false;
        this.$forceUpdate();
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onIconClick: function (e) {
      if (this.isPopIcon) {
        this.showPoporver = !this.showPoporver;
        this.$emit('icon-click', { id: this.uuid, status: this.showPoporver, event: e });
      }
    },
    sendPleaseRead: function () {
      if (!this.thread) {
        return;
      }

      try {
        $lycaon.axios.post(
          '/api/v1/member/messages/create',
          {
            id: this.user.id,
            contents: `#${this.thread.no} ${this.i18n('I updated the thread, so please check it')}`,
          },
          {}
        );
        $lycaon.successToast('You have sent a message to {0} asking you to read this thread', [this.user.fullName]);
      } catch (error) {
        console.log(error);
      }
    },
    teamLink: function (team) {
      return `/${this.organization.handleId}/team/${team.id}`;
    },
  },
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
    messageLink: function () {
      return `/${this.organization.handleId}/member/${this.user.id}?tab=tab-message`;
    },
    transform: function () {
      var position = $(this.$refs.userIdentity).position();
      var top = position.top + 6;
      var left = position.left + 20;
      return `position absolute; transform: translate3d(${left}px, ${top}px, 0px); top: 0px; left: 0px; will-change: transform;`;
    },
  },
});
