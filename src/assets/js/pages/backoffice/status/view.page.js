parasails.registerPage('backoffice-status-view', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    percentFormatter: percentFormatter,
    floatFormatter: floatFormatter,
    dateAgo: $lycaon.formatter.dateAgo,
    diskspace: undefined,
    //…
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    //…
    var self = this;
    this.$nextTick(() => {
      var i = 0;
      for (let item of self.top.cpus) {
        self.renderCpuload(i);
        i++;
      }
      self.renderLoadAvg();
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    renderLoadAvg: function () {
      //uptime span 1 or 5 or 15
      const span = 15;

      var labels = [];
      var data = Array((60 / span) * 24 * 2);
      data.fill(0.0);

      var dt = new Date();
      dt.setHours(0, 0, 0, 0);
      dt.setDate(dt.getDate() - 1);

      var self = this;
      var i = 0;
      for (let d of data) {
        var mt = moment(dt)
          .add(i * span, 'm')
          .format('LT');
        if (mt === '00:00') {
          mt = moment(dt)
            .add(i * span, 'm')
            .format('M/D HH:mm');
        }

        labels.push(mt);

        var hour = moment(dt)
          .add(i * span, 'm')
          .format('MM/DD HH:mm');

        var target = _.find(self.loadavg, function (o) {
          return o.hour === hour;
        });

        if (target) {
          if (span === 1) {
            data[i] = target.loadAverage[0];
          } else if (span === 5) {
            data[i] = target.loadAverage[1];
          } else {
            data[i] = target.loadAverage[2];
          }
        }

        i++;
      }

      var c1 = document.getElementById('load-average');
      if (c1) {
        new Chart(c1, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                type: 'line',
                fill: false,
                label: 'cpu load',
                data: data,
              },
            ],
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: 'Load Average Log',
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true,
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Time',
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    //labelString: 'Value',
                  },
                },
              ],
            },
            plugins: {
              colorschemes: {
                scheme: 'tableau.HueCircle19',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    renderCpuload: function (index) {
      var data = {
        labels: ['user', 'nice', 'sys', 'idle', 'irq'],
        datasets: [
          {
            borderWidth: 1,
            data: [
              this.top.cpus[index].user * 100,
              this.top.cpus[index].nice * 100,
              this.top.cpus[index].sys * 100,
              this.top.cpus[index].idle * 100,
              this.top.cpus[index].irq * 100,
            ],
          },
        ],
      };

      var c1 = document.getElementById(this.getIdentity(index));
      c1.getContext('2d').canvas.height = 260;
      if (c1) {
        new Chart(c1, {
          type: 'bar',
          data: data,
          options: {
            elements: {
              rectangle: {
                borderWidth: 2,
              },
            },
            indexAxis: 'y',
            responsive: true,
            scales: {
              xAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: '(%)',
                  },
                },
              ],
            },
            plugins: {
              legend: {
                display: false,
                position: 'right',
              },
              title: {
                display: false,
              },
              colorschemes: {
                scheme: 'tableau.Orange20',
                /**https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html */
              },
            },
          },
        });
      }
    },
    getIdentity: function (index) {
      return `cpu-load-${index}`;
    },
  },
  computed: {},
});
