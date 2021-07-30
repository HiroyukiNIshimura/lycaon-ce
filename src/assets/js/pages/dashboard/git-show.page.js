parasails.registerPage('git-show', {
  mixins: [messageNotify],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    showdata: '',
    syncing: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    //
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    getDetail: async function (row) {
      this.syncing = true;
      try {
        var response = await $lycaon.axios.get(`/api/v1/git/diff/${this.id}/${row}`, {});
        if (response && response.data && response.data.diffs.length > 0) {
          this.diffs[row] = response.data.diffs[0];
          this.$forceUpdate();
          this.$nextTick(() => {
            PR.prettyPrint();
            this.syncing = false;
          });
        }
      } catch (error) {
        console.log(error);
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
    bottomBtnShow: function () {
      return [...this.response].length > 1000;
    },
  },
});
