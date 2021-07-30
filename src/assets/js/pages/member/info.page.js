parasails.registerPage('member-info', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    labels: [],
    datasets: [],
    queryResults: [],
    queryCount: 0,
    selectedMessage: {},
    currentPage: 1,
    selectedTab: {},
    isEditArrived: false,
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
    //…
    var self = this;
    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.socketToast(response.message);

        if (self.selectedTab.tab.id === 'tab-message') {
          var entry = _.find(self.queryResults, (o) => {
            return o.id === response.data.id;
          });
          if (!entry) {
            _.each(self.queryResults, (o) => {
              delete o.fresh;
            });
            response.data.fresh = true;
            self.queryResults.unshift(response.data);
          }
        }
      }
    });

    io.socket.on('message-read', (response) => {
      if (response.data.sendFrom === self.me.id) {
        if (self.selectedTab.tab.id === 'tab-message') {
          var index = _.findIndex(self.queryResults, (o) => {
            return o.id === response.data.id;
          });
          if (index > -1) {
            self.$set(self.queryResults[index], 'readAt', response.data.readAt);
          }
          $lycaon.socketToast({
            key: 'The message addressed to {0} has been read',
            params: [response.sendTo.fullName],
          });
        }
      }
    });

    io.socket.on('message-edit-in', (response) => {
      if (response.me.id === self.user.id && response.partner === self.me.id) {
        self.isEditArrived = true;
      }
    });
    io.socket.on('message-edit-out', (response) => {
      if (response.me.id === self.user.id && response.partner === self.me.id) {
        self.isEditArrived = false;
      }
    });

    if (this.tab) {
      this.$refs.menberInfo.selectTab('#' + this.tab);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onEditorFocus: function () {
      $lycaon.socket.post('/ws/v1/message-edit-in', { partner: this.user.id });
    },
    onEditorBlur: function () {
      $lycaon.socket.post('/ws/v1/message-edit-out', { partner: this.user.id });
    },
    renderMonthlyCharts: function () {
      var c1 = document.getElementById('monthly-chart');
      if (c1) {
        new Chart(c1, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.datasets,
          },
          options: {
            scales: {
              xAxes: [
                {
                  //stacked: true,
                },
              ],
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  //stacked: true,
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',

                  // grid line settings
                  gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              ],
            },
            responsive: true,
            legend: {
              position: 'left',
            },
            //elements: { line: { tension: 0, borderWidth: 3 } },
            plugins: {
              colorschemes: {
                scheme: 'tableau.Tableau20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    renderDailyCharts: function () {
      var c1 = document.getElementById('daily-chart');
      if (c1) {
        new Chart(c1, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.datasets,
          },
          options: {
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  stacked: true,
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',

                  // grid line settings
                  gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              ],
            },
            responsive: true,
            legend: {
              position: 'left',
            },
            //elements: { line: { tension: 0, borderWidth: 3 } },
            plugins: {
              colorschemes: {
                scheme: 'tableau.Tableau20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    renderHourlyCharts: function () {
      var c1 = document.getElementById('hourly-chart');
      if (c1) {
        new Chart(c1, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.datasets,
          },
          options: {
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  stacked: true,
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',

                  // grid line settings
                  gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              ],
            },
            responsive: true,
            legend: {
              position: 'left',
            },
            //elements: { line: { tension: 0, borderWidth: 3 } },
            plugins: {
              colorschemes: {
                scheme: 'tableau.Tableau20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    renderWeeklyCharts: function () {
      var c1 = document.getElementById('weekly-chart');
      if (c1) {
        new Chart(c1, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.datasets,
          },
          options: {
            scales: {
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',

                  // grid line settings
                  gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              ],
            },
            responsive: true,
            legend: {
              position: 'left',
            },
            //elements: { line: { tension: 0, borderWidth: 3 } },
            plugins: {
              colorschemes: {
                scheme: 'tableau.Tableau20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    mapLabel: function (label) {
      var map = {
        create: i18next.t('Thread creation'),
        effects: i18next.t('Thread operation'),
        responsible: i18next.t('In charge of threads'),
        working: i18next.t('Thread work'),
        sneeze: i18next.t('Comment'),
        reply: i18next.t('Reply'),
        file: i18next.t('File'),
        wiki: i18next.t('Wiki'),
        git: i18next.t('git log'),
      };
      return map[label];
    },
    tabChanged: function (selectedTab) {
      this.selectedTab = selectedTab;
      if (selectedTab.tab.id === 'tab-message') {
        this.clearData();
        this.submitForm('#query-message-form');
      }
      if (selectedTab.tab.id === 'tab-monthly') {
        this.submitForm('#query-monthly-form');
      }
      if (selectedTab.tab.id === 'tab-daily') {
        this.submitForm('#query-daily-form');
      }
      if (selectedTab.tab.id === 'tab-weekly') {
        this.submitForm('#query-weekly-form');
      }
      if (selectedTab.tab.id === 'tab-hourly') {
        this.submitForm('#query-hourly-form');
      }
    },
    submittedMonthlyForm: function (response) {
      if (!response.analytics) {
        console.log('data not found!');
        return;
      }

      this.datasets = [];
      this.labels = response.labels;

      var self = this;
      _.forEach(response.summary, (values, key) => {
        var data = Array(13);
        data.fill(0);

        _.forEach(values, (val) => {
          var index = _.findIndex(self.labels, (entry) => {
            return entry === val.dt;
          });
          if (index > -1) {
            data[index] = val.qty;
          }
        });

        if (key === 'wiki' || key === 'git') {
          self.datasets.push({
            type: 'line',
            fill: false,
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-2',
          });
        } else {
          self.datasets.push({
            type: 'bar',
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-1',
          });
        }
      });

      this.$nextTick(() => {
        this.renderMonthlyCharts();
      });
    },
    handleParsingMonthlyForm: function () {
      var argins = { id: this.user.id, range: 'month' };
      return argins;
    },
    submittedDailyForm: function (response) {
      if (!response.analytics) {
        console.log('data not found!');
        return;
      }

      this.datasets = [];
      this.labels = response.labels;

      var self = this;
      _.forEach(response.summary, (values, key) => {
        var data = Array(31);
        data.fill(0);

        _.forEach(values, (val) => {
          var index = _.findIndex(self.labels, (entry) => {
            return entry === Number(val.dt);
          });
          if (index > -1) {
            data[index] = val.qty;
          }
        });

        if (key === 'wiki' || key === 'git') {
          self.datasets.push({
            type: 'line',
            fill: false,
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-2',
          });
        } else {
          self.datasets.push({
            type: 'bar',
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-1',
          });
        }
      });

      this.$nextTick(() => {
        this.renderDailyCharts();
      });
    },
    handleParsingDailyForm: function () {
      var argins = { id: this.user.id, range: 'day' };
      return argins;
    },
    submittedHourlyForm: function (response) {
      if (!response.analytics) {
        console.log('data not found!');
        return;
      }

      this.datasets = [];
      this.labels = response.labels;

      var self = this;
      _.forEach(response.summary, (values, key) => {
        var data = Array(24);
        data.fill(0);

        _.forEach(values, (val) => {
          var index = _.findIndex(self.labels, (entry) => {
            return entry === Number(val.dt);
          });
          if (index > -1) {
            data[index] = val.qty;
          }
        });

        if (key === 'wiki' || key === 'git') {
          self.datasets.push({
            type: 'line',
            fill: false,
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-2',
          });
        } else {
          self.datasets.push({
            type: 'bar',
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-1',
          });
        }
      });

      this.$nextTick(() => {
        this.renderHourlyCharts();
      });
    },
    handleParsingHourlyForm: function () {
      var argins = { id: this.user.id, range: 'hour' };
      return argins;
    },
    submittedWeeklyForm: function (response) {
      if (!response.analytics) {
        console.log('data not found!');
        return;
      }

      this.datasets = [];
      this.labels = response.labels;
      var self = this;
      _.forEach(response.summary, (values, key) => {
        var data = Array(7);
        data.fill(0);

        _.forEach(values, (val) => {
          data[val.dt - 1] = val.qty;
        });

        if (key === 'wiki' || key === 'git') {
          self.datasets.push({
            type: 'line',
            fill: false,
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-2',
          });
        } else {
          self.datasets.push({
            type: 'bar',
            label: self.mapLabel(key),
            data: data,
            yAxisID: 'y-axis-1',
          });
        }
      });

      this.$nextTick(() => {
        this.renderWeeklyCharts();
      });
    },
    clearData: function () {
      this.queryResults = [];
      this.queryCount = 0;
      this.currentPage = 1;
    },
    handleParsingWeeklyForm: function () {
      var argins = { id: this.user.id, range: 'week' };
      return argins;
    },
    messageHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-message-form');
    },
    handleParsingMessageForm: function () {
      var argins = { id: this.user.id, page: this.currentPage };
      return argins;
    },
    submittedMessageForm(response) {
      if (!response.data) {
        console.log('data not found!');
        return;
      }

      this.queryCount = response.records;
      if (response.data.length) {
        this.currentPage += 1;
        this.queryResults.push(...response.data);
        if (this.infiniteState) {
          this.infiniteState.loaded();
        }
      } else {
        if (this.infiniteState) {
          this.infiniteState.complete();
        }
      }
      this.cloudSuccess = true;
      this.syncing = false;
    },
    sendMessage: function () {
      this.submitForm('#create-message-form');
    },
    handleParsingCreateMessageForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      if (!this.formData.contents) {
        this.formErrors.contents = true;
      } else {
        if ([...this.formData.contents].length > 2000) {
          this.formErrors.contentsLength = true;
        }
      }

      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return { id: this.user.id, contents: this.formData.contents };
    },
    submittedCreateMessageForm() {
      this.cloudSuccess = true;
      this.clearData();
      this.formData.contents = '';

      $lycaon.successToast('The message has been sended');

      this.$nextTick(() => {
        this.submitForm('#query-message-form');
      });
    },
    handleParsingReadMessageForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = { id: this.selectedMessage.id };
      return argins;
    },
    submittedReadMessageForm() {
      this.cloudSuccess = true;
      this.syncing = true;
    },
    messageStyle: function (item) {
      if (item.sendFrom === this.me.id) {
        return 'my-message';
      }
      if (item.fresh) {
        return 'your-message fresh';
      }
      return 'your-message';
    },
    isMyMessage: function (item) {
      return item.sendFrom === this.me.id;
    },
    getId: function (item) {
      if (item.sendFrom === this.me.id) {
        return `my-message-${item.id}`;
      }

      if (item.readAt) {
        return `readed-${item.id}`;
      }
      return `message-${item.id}`;
    },
    onRead: async function (el) {
      if (el.id.startsWith('message-')) {
        var id = el.id.replace('message-', '');

        try {
          await $lycaon.axios.put(`/api/v1/member/messages/read/${id}`, {});

          el.id = `readed-${id}`;
        } catch (err) {
          console.log(err);
        }
      }
    },
    normalize: function (contents) {
      const markdownIt = window.markdownit();
      var linkify = markdownIt.linkify;

      var matchs = linkify.match(contents);
      _.each(matchs, (match) => {
        var el = `<a href="${match.url}">${match.text}</a>`;
        var re = new RegExp(match.text.trim());
        contents = contents.replace(re, el);
      });

      var result = '';
      var data = contents.split('\n');
      _.each(data, (line) => {
        result = result + `<p class="message-content">${line}</p>`;
      });
      return result;
    },
  },
  computed: {
    returnLink: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }
      return '/';
    },
    messegeLabel: function () {
      return this.i18n('Enter a message for {0}').format(this.user.fullName);
    },
    enableMessageTab: function () {
      //TODO
      //将来的にはしゃべらせたい😅
      if (this.user.emailAddress === 'lycaonbot@example.com') {
        return false;
      }

      if (this.me.id !== this.user.id) {
        return true;
      }
      return false;
    },
  },
});
