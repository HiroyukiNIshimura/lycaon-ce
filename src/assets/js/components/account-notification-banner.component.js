/**
 * <account-notification-banner>
 * -----------------------------------------------------------------------------
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('accountNotificationBanner', {
  //  ╔═╗╦ ╦╔╗ ╦  ╦╔═╗  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝║ ║╠╩╗║  ║║    ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╚═╝╚═╝╩═╝╩╚═╝  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╦╔╗╔╔╦╗╔═╗╦═╗╔╗╔╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ║║║║ ║ ║╣ ╠╦╝║║║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╩╝╚╝ ╩ ╚═╝╩╚═╝╚╝╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      notificationText: '',
      roomName: undefined,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div>
    <div class="container-fluid">
      <div class="alert alert-warning mt-2" role="alert" v-if="notificationText">
        {{notificationText}}
      </div>
    </div>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  mounted: async function () {
    try {
      await Cloud.observeMySession();
    } catch (error) {
      console.log(error);
      location.href = '/';
    }

    // Listen for updates to the user's session
    Cloud.on('session', (msg) => {
      if (msg.notificationText && document.hidden) {
        this.notificationText = msg.notificationText;
      } else {
        this.notificationText = '';
      }
    }); //œ
  },

  beforeDestroy: function () {
    Cloud.off('session');
  },

  watch: {
    loggedInUserId: function (unused) {
      throw new Error('Changes to `loggedInUserId` are not currently supported in <account-notification-banner>!');
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //  ╦╔╗╔╔╦╗╔═╗╦═╗╔╗╔╔═╗╦    ╔═╗╦  ╦╔═╗╔╗╔╔╦╗  ╦ ╦╔═╗╔╗╔╔╦╗╦  ╔═╗╦═╗╔═╗
    //  ║║║║ ║ ║╣ ╠╦╝║║║╠═╣║    ║╣ ╚╗╔╝║╣ ║║║ ║   ╠═╣╠═╣║║║ ║║║  ║╣ ╠╦╝╚═╗
    //  ╩╝╚╝ ╩ ╚═╝╩╚═╝╚╝╩ ╩╩═╝  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩   ╩ ╩╩ ╩╝╚╝═╩╝╩═╝╚═╝╩╚═╚═╝
    //…
    //  ╔═╗╦ ╦╔╗ ╦  ╦╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
    //  ╠═╝║ ║╠╩╗║  ║║    ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
    //  ╩  ╚═╝╚═╝╩═╝╩╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
    // > Public methods are rarely exposed by Vue components, but sometimes they
    // > are an important escape hatch.  They are callable via something like
    // > `this.$refs.componentNameInCamelCase.doSomething())`, and, by convention,
    // > are always prefixed with "do".
    // N/A
    //  ╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
    //  ╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
    //  ╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
    //…
  },
});
