parasails.registerPage('notification-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    formatDate: $lycaon.formatter.formatDate,
    formatDatetime: $lycaon.formatter.formatDatetime,
    currentPage: 1,
    queryResults: [],
    queryCount: 0,

    mounted: false,
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
  beforeMount: function () {},
  mounted: async function () {
    this.submitForm('#query-form');
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submitForm: function (selector) {
      var form = _.find(this.$children, {
        $el: $(selector)[0],
      });
      form.submit();
    },
    infiniteHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-form');
    },
    submittedQueryForm: function (response) {
      this.mounted = true;
      if (!response.data) {
        console.log('data not found!');
        return;
      }

      this.queryCount = response.records;
      if (response.data.length) {
        this.currentPage += 1;
        this.queryResults.push(...response.data);
        if (this.infiniteState) this.infiniteState.loaded();
      } else {
        if (this.infiniteState) this.infiniteState.complete();
      }
      this.cloudSuccess = true;
    },
    handleParsingQueryForm: function () {
      var argins = { page: this.currentPage };

      return argins;
    },
    itemLink: function (item) {
      return `/notification/${item.id}`;
    },
  },
  computed: {
    backToLink: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }

      return '/';
    },
  },
});
