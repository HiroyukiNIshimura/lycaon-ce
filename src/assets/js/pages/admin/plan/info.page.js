parasails.registerPage('admin-plan-info', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    floatFormatter: floatFormatter,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {},
  computed: {
    changeLink: function () {
      return `/${this.organization.handleId}/admin/plan/change`;
    },
    unsubscribedLink: function () {
      return `/${this.organization.handleId}/admin/plan/unsubscribed`;
    },
    storageUsed: function () {
      if (!this.planlimitation.maxQuota) {
        return this.floatFormatter.format(0);
      }
      return this.floatFormatter.format(
        ((this.thread + this.vote + this.wiki) / this.planlimitation.maxQuota) * 100
      );
    },
    storageUsedStyle: function () {
      return `width: ${this.storageUsed}%`;
    },
    planStyle: function () {
      if (this.organization.plan === 'pine') {
        return 'card-header-info';
      }
      if (this.organization.plan === 'prime') {
        return 'card-header-warning';
      }
      if (this.organization.plan === 'bamboo') {
        return 'card-header-success';
      }
      if (this.organization.plan === 'plum') {
        return 'card-header-primary';
      }
      return '';
    },
  },
});
