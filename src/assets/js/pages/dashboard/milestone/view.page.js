parasails.registerPage('milestone-view', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    floatFormatter: floatFormatter,
    tasks: [],
    dynamicStyle: {
      'task-list-header-label': {
        'font-weight': 'bold',
      },
    },
    options: {},
    headerOptions: {
      title: {
        label: i18next.t('Milestone'),
        html: false,
      },
      locale: {
        Now: 'Now',
        'X-Scale': 'Zoom-X',
        'Y-Scale': 'Zoom-Y',
        'Task list width': 'Task list',
        'Before/After': 'Expand',
        'Display task list': 'Task list',
      },
    },
    headrDynamicStyle: {
      'header-label': { 'margin-right': '0.5rem', 'font-size': '12px' },
      'header-task-list-switch--label': { 'font-size': '12px' },
      'header-btn-recenter': {
        background: '#95A5A6',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        color: 'white',
        'border-radius': '3px',
        'margin-right': '25px',
        'font-size': '12px',
        padding: '8px 12px',
      },
      'header-title--text': {
        'font-size': '20px',
        'vertical-align': 'middle',
        'font-weight': '400',
        'line-height': '35px',
        'padding-left': '22px',
        'letter-spacing': '1px',
      },
    },
    noResults: false,
    burndownDialog: false,
    serverMessage: 'No results',
    openClose: {},
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    var self = this;

    this.options = {
      maxRows: 100,
      maxHeight: 300,
      title: {
        label: '',
        html: false,
      },
      row: {
        height: 24,
      },
      scope: {
        //*
        before: 2,
        after: 32,
      },
      times: {
        timeZoom: 23, //*
      },
      chart: {
        progress: {
          bar: false,
        },
        expander: {
          display: false,
        },
      },
      taskList: {
        expander: {
          straight: false,
        },
        columns: [
          {
            id: 1,
            label: 'ID',
            value: 'id',
            width: 40,
          },
          {
            id: 2,
            label: i18next.t('Name'),
            value: 'label',
            width: 120,
            expander: false,
            html: true,
          },
          {
            id: 3,
            label: '#',
            value: 'thread',
            width: 30,
            expander: false,
            html: true,
            events: {
              click({ data /*column*/ }) {
                self.clickThreads(data);
              },
            },
          },
          {
            id: 4,
            label: i18next.t('Person in charge'),
            value: 'user',
            width: 90,
            html: true,
          },
          {
            id: 5,
            label: i18next.t('Start date'),
            value: (task) => dayjs(task.start).format('YYYY-MM-DD'),
            width: 78,
          },
          {
            id: 6,
            label: '%',
            value: 'progress',
            width: 35,
            style: {
              'task-list-header-label': {
                'text-align': 'center',
                width: '100%',
              },
              'task-list-item-value-container': {
                'text-align': 'center',
                width: '100%',
              },
            },
            html: true,
            events: {
              click({ data /*column*/ }) {
                self.showBurndownDialog(data);
              },
            },
          },
        ],
      },
      calendar: {
        workingDays: [1, 2, 3, 4, 5], //*
        gap: 6, //*
        hour: {
          display: false,
          format: {
            //*
            long(date) {
              return date.format('HH:mm');
            },
            medium(date) {
              return date.format('HH:mm');
            },
            short(date) {
              return date.format('HH');
            },
          },
        },
        day: {
          format: {
            //*
            long(date) {
              return date.format('DD (dddd)');
            },
            medium(date) {
              return date.format('DD (ddd)');
            },
            short(date) {
              return date.format('DD');
            },
          },
        },
        month: {
          format: {
            //*
            short(date) {
              return date.format('MM');
            },
            medium(date) {
              return date.format('YY MMM');
            },
            long(date) {
              return date.format('YYYY MMMM');
            },
          },
        },
      },
      locale: {
        name: self.language, // name String
        weekdays: i18next.t('Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday').split('_'), // weekdays Array
        weekdaysShort: i18next.t('Sun_Mon_Tue_Wed_Thu_Fri_Sat').split('_'), // OPTIONAL, short weekdays Array, use first three letters if not provided
        weekdaysMin: i18next.t('Sun_Mon_Tue_Wed_Thu_Fri_Sat').split('_'), // OPTIONAL, min weekdays Array, use first two letters if not provided
        months: i18next
          .t('January_February_March_April_May_June_July_August_September_October_November_December')
          .split('_'), // months Array
        monthsShort: i18next.t('Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec').split('_'), // OPTIONAL, short months Array, use first three letters if not provided
        ordinal: (n) => `${n}`, // ordinal Function (number) => return number + output
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: 'a few seconds',
          m: 'a minute',
          mm: '%d minutes',
          h: 'an hour',
          hh: '%d hours',
          d: 'a day',
          dd: '%d days',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years',
        },
        formats: {
          LT: 'HH:mm',
          LTS: 'HH:mm:ss',
          L: 'YYYY/MM/DD',
          LL: 'YYYY MM D',
          LLL: 'YYYY MM D HH:mm',
          LLLL: 'YYYY MM D(dddd) HH:mm',
        },
      },
    };

    _.each(this.milestone, (entry) => {
      let user = '';
      if (entry.user) {
        user = `<a href="/member/${entry.user.id}" target="_blank" style="color:#0077c0;">${entry.user.fullName}</a>`;
      }

      var progress = self.progressValue(entry);
      var start = entry.startAt ? new Date(Number(entry.startAt)) : undefined;
      if (start) {
        start.setHours(0, 0, 0, 0);
      }

      let task = {
        id: entry.viewLineNo,
        label: `<a href="/${self.organization.handleId}/milestone/edit/${
          entry.id
        }" style="color:#0077c0;" data-toggle="tooltip" data-placement="bottom" title="${i18next.t('Edit')}">${
          entry.name
        }</a>`,
        user: user,
        thread: `<a href="javascript:void(0)" data-toggle="tooltip" data-placement="bottom" title="${i18next.t(
          'Related thread'
        )}"><i class="fas fa-tasks"></i></a>`,
        start: start,
        duration: entry.duration ? Number(entry.duration) : 0,
        progress: `<a href="javascript:void(0)" style="color:#0077c0;" data-toggle="tooltip" data-placement="bottom" title="${i18next.t(
          'Burndown chart'
        )}">${progress}</a>`,
        type: 'task', //project, milestone, task
        entity: entry,
        milestoneId: entry.id,
      };
      self.tasks.push(task);
    });
  },
  mounted: async function () {
    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }

    var self = this;
    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickNew: function () {
      location.href = `/${this.organization.handleId}/milestone/create/${this.team.id}`;
    },
    clickSort: function () {
      location.href = `/${this.organization.handleId}/milestone/sort/${this.team.id}`;
    },
    clickThreads: function (data) {
      location.href = `/${this.organization.handleId}/team/${this.team.id}/milestone/${data.milestoneId}`;
    },
    clickThreadsForMobile: function (data) {
      location.href = `/${this.organization.handleId}/team/${this.team.id}/milestone/${data.id}`;
    },
    editLink: function (data) {
      return `/${this.organization.handleId}/milestone/edit/${data.id}`;
    },
    memberLink: function (data) {
      if (!data.user) {
        return '#';
      }
      return `/${this.organization.handleId}/member/${data.user.id}`;
    },
    startDate: function (data) {
      return $lycaon.formatter.formatDate(Number(data.startAt));
    },
    endDate: function (data) {
      return $lycaon.formatter.formatDate(Number(data.startAt) + Number(data.duration));
    },
    progressStyle: function (data) {
      var val = this.progressValue(data);
      return `width: ${val}%`;
    },
    progressValue: function (data) {
      var progress = 0;
      var openQty = data.openQty ? Number(data.openQty) : 0;
      var closedQty = data.closedQty ? Number(data.closedQty) : 0;
      if (openQty + closedQty > 0) {
        progress = Math.round((closedQty / (openQty + closedQty)) * 100);
      }
      return progress;
    },
    showBurndownDialog: async function (data) {
      var url = `/api/v1/milestone/burndown/${data.milestoneId}`;

      if (this.isMobile) {
        url = `/api/v1/milestone/burndown/${data.id}`;
      }

      var burndownConfig;
      var resouceConfig;
      this.noResults = true;

      try {
        var response = await $lycaon.axios.get(url, {});
        if (response && response.data) {
          if (response.data.burndown) {
            this.noResults = false;

            var buildBurndown = function () {
              var labels = _.keys(response.data.burndown);
              labels[0] = '';
              var ideal = [];
              var plan = [];
              var achievement = [];
              _.mapKeys(response.data.burndown, (value) => {
                ideal.push(value.ideal);
                plan.push(value.plan);
                achievement.push(value.achievement);
              });

              var config = {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [
                    {
                      label: i18next.t('_ideal_'),
                      data: ideal,
                      radius: 0,
                      lineTension: 0,
                      fill: false,
                    },
                    {
                      label: i18next.t('_plan_'),
                      data: plan,
                      radius: 0,
                      lineTension: 0,
                      fill: false,
                    },
                    {
                      label: i18next.t('_performance_'),
                      data: achievement,
                      radius: 0,
                      lineTension: 0,
                      fill: false,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  plugins: {
                    colorschemes: {
                      scheme: 'brewer.Accent3',
                      /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
                    },
                  },
                },
              };
              return config;
            };

            var self = this;
            var buildResource = function () {
              var labels = _.map(response.data.openClose.members, (o) => {
                return o.fullName;
              });

              var datasets = [
                {
                  data: _.map(response.data.openClose.members, (o) => {
                    return o.burden;
                  }),
                },
              ];

              var aspectRatio = 2 / response.data.openClose.members.length;
              if (self.isMobile) {
                aspectRatio = aspectRatio * 4;
              } else {
                aspectRatio = aspectRatio * 10;
              }

              var config = {
                type: 'bar',
                data: {
                  labels: labels,
                  datasets: datasets,
                },
                options: {
                  indexAxis: 'y',
                  responsive: true,
                  aspectRatio: aspectRatio,
                  scales: {
                    xAxes: [{ ticks: { beginAtZero: true } }],
                  },
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: i18next.t('Thread in charge'),
                    },
                    colorschemes: {
                      scheme: 'brewer.PastelTwo3',
                      /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
                    },
                  },
                },
              };
              return config;
            };

            burndownConfig = buildBurndown();
            resouceConfig = buildResource();
          }

          this.openClose = response.data.openClose;

          if (response.data.message) {
            this.serverMessage = response.data.message;
          }
        }
      } catch (error) {
        console.log(error);
      }

      this.burndownDialog = true;

      this.$nextTick(() => {
        if (burndownConfig) {
          new Chart(document.getElementById('burndown-chart'), burndownConfig);
        }
        if (resouceConfig) {
          new Chart(document.getElementById('resource-chart'), resouceConfig);
        }
      });
    },
  },
  computed: {
    returnUrl: function () {
      if (this.backToUrl) {
        return this.backToUrl;
      }
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
    teamUrl: function () {
      return `/${this.organization.handleId}/team/${this.team.id}`;
    },
    isMobile: function () {
      if (!bowser) {
        return false;
      }
      return !!bowser.mobile || !!bowser.tablet;
    },
    getServerMessage: function () {
      return i18next.t(this.serverMessage);
    },
  },
});
