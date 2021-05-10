parasails.registerPage('main', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    formatDate: $lycaon.formatter.formatDate,
    formatDatetime: $lycaon.formatter.formatDatetime,
    currentPage: 1,
    queryResults: [],
    queryCount: 0,
    selectedCategory: '',
    selectedStatus: '0',
    openActive: 'active',
    closeActive: '',
    newVoteActive: 'active',
    openVoteActive: '',
    closeVoteActive: '',
    myVoteActive: '',
    selectedWikiTags: [],
    tagifySettings: {},
    panelId: 'main-tab-panel',
    wikiflags: false,
    nonmyown: false,
    selectedTab: {},
    counter: {
      working: 0,
      myThread: 0,
      votes: 0,
      flag: 0,
      local: 0,
    },
    voteState: '0',
    notifyStack: [],
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
  beforeMount: function () {
    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('You can add up to {0} tags to a condition').format(10),
      enforceWhitelist: true,
      maxTags: 10,
      dropdown: {
        maxItems: undefined,
        closeOnSelect: true,
      },
    });

    var self = this;
    _.each(this.tags, (entry) => {
      self.tagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });
  },
  mounted: async function () {
    $('#nav-tab a').on('click', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    var self = this;
    io.socket.on('thread-notify', function (data) {
      if (data.user.id !== self.me.id) {
        $lycaon.stackExchange(data, self.notifyStack, self.me.organization.handleId);
        if (!self.me.noRaiseThreadNotify) {
          $lycaon.reloadRequestToast(data.message);
        }
        self.submitForm('#query-counter-form');
      }
    });
    io.socket.on('message-notify', function (response) {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);
  },
  watch: {
    selectedCategory: function (val) {
      this.clearData();
      this.submitForm('#query-thread-form');
    },
    selectedStatus: function (val) {
      if (val == 0) {
        this.openActive = 'active';
        this.closeActive = '';
      } else {
        this.openActive = '';
        this.closeActive = 'active';
      }
      this.clearData();
      this.submitForm('#query-thread-form');
    },
    voteState: function (val) {
      if (val == '0') {
        this.newVoteActive = 'active';
        this.openVoteActive = '';
        this.closeVoteActive = '';
        this.myVoteActive = '';
      } else if (val == '1') {
        this.newVoteActive = '';
        this.openVoteActive = 'active';
        this.closeVoteActive = '';
        this.myVoteActive = '';
      } else if (val == '2') {
        this.newVoteActive = '';
        this.openVoteActive = '';
        this.closeVoteActive = 'active';
        this.myVoteActive = '';
      } else {
        this.newVoteActive = '';
        this.openVoteActive = '';
        this.closeVoteActive = '';
        this.myVoteActive = 'active';
      }
      this.clearData();
      this.submitForm('#query-vote-form');
    },
    wikiflags: function (val) {
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    nonmyown: function (val) {
      this.clearData();
      this.submitForm('#query-activity-form');
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    renderCharts: function () {
      _.each(this.teams, (entry) => {
        var c1 = document.getElementById(this.teamChartId(entry));
        var c2 = document.getElementById(this.teamChartSubId(entry));

        if (c1 && c2) {
          var open = entry.summary.open;
          var close = entry.summary.total - open;
          new Chart(c1, {
            type: 'pie',
            data: {
              datasets: [
                {
                  data: [open, close],
                  fill: false,
                  borderWidth: 1,
                },
              ],
              labels: [
                `${i18next.t('open')}: ${formatter.format(open)}`,
                `${i18next.t('close')}: ${formatter.format(close)}`,
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
              plugins: {
                legend: {
                  position: 'left',
                },
                title: { display: false, text: i18next.t('Open : Closed'), padding: 0 },
                colorschemes: {
                  scheme: 'brewer.PastelOne9',
                },
              },
            },
          });

          new Chart(c2, {
            type: 'pie',
            data: {
              datasets: [
                {
                  data: [entry.summary.working, entry.summary.expired, entry.summary.notAssignment],
                  fill: false,
                  borderWidth: 1,
                },
              ],
              labels: [
                `${i18next.t('Working')}: ${formatter.format(entry.summary.working)}`,
                `${i18next.t('Expired')}: ${formatter.format(entry.summary.expired)}`,
                `${i18next.t('Not in charge_2')}: ${formatter.format(entry.summary.notAssignment)}`,
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
              plugins: {
                legend: {
                  position: 'left',
                },
                title: { display: false, text: i18next.t('Details of the open'), padding: 0 },
                colorschemes: {
                  scheme: 'brewer.SetThree9',
                },
              },
            },
          });
        }
      });
    },
    clearData: function () {
      this.queryResults = [];
      this.queryCount = 0;
      this.currentPage = 1;
    },
    tabChanged: function (selectedTab) {
      this.clearData();
      this.selectedTab = selectedTab;

      if (selectedTab.tab.id === 'tab-team') {
        this.$nextTick(() => {
          this.renderCharts();
          this.submitForm('#query-counter-form');
        });
      }
      if (selectedTab.tab.id === 'tab-thread') {
        this.submitForm('#query-thread-form');
      }
      if (selectedTab.tab.id === 'tab-activity') {
        this.submitForm('#query-activity-form');
      }
      if (selectedTab.tab.id === 'tab-flag') {
        this.submitForm('#query-flag-form');
      }
      if (selectedTab.tab.id === 'tab-working') {
        this.submitForm('#query-working-form');
      }
      if (selectedTab.tab.id === 'tab-private') {
        this.submitForm('#query-private-form');
      }
      if (selectedTab.tab.id === 'tab-buzz') {
        this.submitForm('#query-buzz-form');
      }
      if (selectedTab.tab.id === 'tab-wiki') {
        this.submitForm('#query-wiki-form');
      }
      if (selectedTab.tab.id === 'tab-circular') {
        this.submitForm('#query-vote-form');
      }
    },
    onAddWikiTagify: function (e) {
      this.selectedWikiTags.push(e.detail.data);
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    onRemoveWikiTagify: function (e) {
      this.selectedWikiTags = _.reject(this.selectedWikiTags, (entry) => {
        return entry.value === e.detail.data.value;
      });
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    teamLink: function (item) {
      return `/${this.organization.handleId}/team/${item.id}`;
    },
    teamChartId: function (item) {
      return 'chart-' + item.id;
    },
    teamChartSubId: function (item) {
      return 'chart-sub-' + item.id;
    },
    threadLink: function (item) {
      return `/${this.organization.handleId}/thread/${item.no}`;
    },
    submitForm: function (selector) {
      var form = _.find(this.$children, {
        $el: $(selector)[0],
      });
      form.submit();
    },
    submittedQueryForm: function (response) {
      if (!response.data) {
        console.log('data not found!');
        return;
      }

      var page = this.currentPage;

      this.queryCount = response.records;
      if (response.data.length) {
        this.currentPage += 1;
        this.queryResults.push(...response.data);
        if (this.infiniteState) this.infiniteState.loaded();
      } else {
        if (this.infiniteState) this.infiniteState.complete();
      }
      this.cloudSuccess = true;

      if (bowser && (bowser.mobile || bowser.tablet) && page === 1) {
        $lycaon.jumpTo($('#main-tab-panel'));
      }

      this.$nextTick(() => {
        var option = { animate: 'slide' };
        if (bowser && bowser.mobile) {
          option = {};
        }
        $('#activity-timeline').verticalTimeline(option);

        this.submitForm('#query-counter-form');
      });
    },
    handleParsingQueryForm: function () {
      var argins = { page: this.currentPage };
      return argins;
    },
    handleParsingQueryMyThreadForm: function () {
      var argins = { page: this.currentPage };
      if (this.selectedCategory) {
        argins.category = this.selectedCategory;
      }
      argins.status = this.selectedStatus;
      return argins;
    },
    handleParsingQueryActivityForm: function () {
      var argins = { page: this.currentPage, nonmyown: this.nonmyown };
      return argins;
    },
    handleParsingQueryWikiForm: function () {
      var argins = {
        tags: this.selectedWikiTags,
        isFlags: this.wikiflags,
        page: this.currentPage,
      };
      return argins;
    },
    handleParsingQueryVoteForm: function () {
      var argins = {
        page: this.currentPage,
        voteState: Number(this.voteState),
      };
      return argins;
    },
    threadHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-team-form');
    },
    myThreadHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-thread-form');
    },
    activityHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-activity-form');
    },
    flagHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-flag-form');
    },
    localHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-private-form');
    },
    workingHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-working-form');
    },
    buzzHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-buzz-form');
    },
    wikiHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-wiki-form');
    },
    circularHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-wiki-form');
    },
    submittedCounterForm: function (response) {
      this.cloudSuccess = true;

      if (!response.counter) {
        console.log('data not found!');
        return;
      }
      if (response.counter) {
        this.counter = Object.assign({}, this.counter, {
          working: response.counter.working,
          myThread: response.counter.myThread,
          votes: response.counter.votes,
          //flag: data.counter.flag,
          //local: data.counter.local,
        });
      }
    },
    handleParsingCounterForm: function () {
      return {};
    },
    onNewVoteCkick: function () {
      location.href = `/${this.organization.handleId}/vote/create`;
    },
  },
  computed: {},
});
