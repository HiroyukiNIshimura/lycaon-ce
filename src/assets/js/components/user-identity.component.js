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
    team: {},
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
      isTeam: false,
    };
  },
  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<span class="ml-1" v-if="user">
  <span :id="parseAvaterId" class="user-avater-icon" :class="molded" @click="onIconClick" ref="userIdentity">
    <img :class="sizeClass" :src="user.gravatarUrl" v-if="user.avatarType === 'gravatar'" />
    <img class="rounded-circle" :class="sizeClass" :src="user.avatarVirtualUrl" v-else-if="user.avatarType === 'user-avatar'" />
    <svg :class="sizeClass" :data-jdenticon-value="user.emailAddress" v-else></svg>
  </span>
  <a :id="parseUserId" class="ml-1 comment-tip" :href="menberInfoLink" v-if="showUserName === true">
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
        <div><a :href="messageLink"><i class="far fa-comment-dots fa-fw"></i> {{ i18n('Send a message') }}</a></div>
        <div v-if="isThread">
          <a href="#" @click.prevent="sendPleaseRead"><i class="fab fa-readme fa-fw"></i> {{ i18n('Please read!') }}</a>
        </div>
        <div v-if="isTeam">
          <a href="#" @click.prevent="searchMember"><i class="fas fa-search-location fa-fw"></i> {{ i18n('Find a member') }}</a>
        </div>
        <div v-if="isTeam">
          <a :href="ownersLink"><i class="fas fa-user-edit fa-fw"></i> {{ i18n('Created threads') }}</a>
        </div>
        <div v-if="isTeam">
          <a :href="responsiblesLink"><i class="fas fa-map-pin fa-fw"></i> {{ i18n('Threads in charge') }} ({{ user.loadQty }})</a>
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
    if (this.team) {
      this.isTeam = true;
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
    searchMember: function () {
      if (!SAILS_LOCALS.lycaonTimestamp) {
        SAILS_LOCALS.lycaonTimestamp = [];
      }
      SAILS_LOCALS.lycaonTimestamp.push({
        serachMember: this.user.id,
        stamp: Date.now(),
      });

      var self = this;
      $lycaon.socket.post('/ws/v1/member-serach', { id: this.team.id, serachMember: this.user.id }, () => {
        setTimeout(() => {
          if (
            _.find(SAILS_LOCALS.lycaonTimestamp, (o) => {
              return o.serachMember === self.user.id;
            })
          ) {
            //
            // eslint-disable-next-line quotes
            $lycaon.linkerToast('#', self.i18n('Unfortunately, {0} was not found immediately', [self.user.fullName]));
            SAILS_LOCALS.lycaonTimestamp = _.filter(SAILS_LOCALS.lycaonTimestamp, (o) => {
              return o.serachMember !== self.user.id;
            });
          }
        }, 5000);
      });
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
    ownersLink: function () {
      return `/${this.organization.handleId}/team/${this.team.id}/owner/${this.user.id}`;
    },
    responsiblesLink: function () {
      return `/${this.organization.handleId}/team/${this.team.id}/responsible/${this.user.id}`;
    },
    transform: function () {
      var position = $(this.$refs.userIdentity).position();
      var top = position.top + 6;
      var left = position.left + 20;
      return `position absolute; transform: translate3d(${left}px, ${top}px, 0px); top: 0px; left: 0px; will-change: transform;`;
    },
    molded: function () {
      if (this.user.mold) {
        return `mold-filter-${this.user.mold}`;
      }
      return '';
    },
  },
});
