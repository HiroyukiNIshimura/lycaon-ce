/**
 * <lycaon-timestamp>
 * -----------------------------------------------------------------------------
 * @type {Component}
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('lycaonTimestamp', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'at',
    'short',
    'format', //'calendar', 'timeago' (defaults to 'timeago')
    'translator',
    'transOption',
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatType: undefined,
      formattedTimestamp: '',
      interval: undefined,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <span>{{formattedTimestamp}}</span>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    if (this.at === undefined) {
      throw new Error(
        'Incomplete usage of <lycaon-timestamp>:  Please specify `at` as a JS timestamp (i.e. epoch ms, a number).  For example: `<lycaon-timestamp :at="something.createdAt">`'
      );
    }
    if (this.format === undefined) {
      this.formatType = 'timeago';
    } else {
      if (!_.contains(['calendar', 'timeago'], this.format)) {
        throw new Error(
          'Unsupported `format` (' +
            this.format +
            // eslint-disable-next-line quotes
            ") passed in to the JS timestamp component! Must be either 'calendar' or 'timeago'."
        );
      }
      this.formatType = this.format;
    }

    // If timeago timestamp, update the timestamp every minute.
    if (this.formatType === 'timeago') {
      this._formatTimeago();
      this.interval = setInterval(async () => {
        try {
          this._formatTimeago();
          await this.forceRender();
        } catch (err) {
          err.raw = err;
          throw new Error(
            'Encountered unexpected error while attempting to automatically re-render <lycaon-timestamp> in the background, as the seconds tick by.  ' +
              err.message
          );
        }
      }, 60 * 1000);
    }

    if (this.formatType === 'calendar') {
      this._formatCalender();
    }
  },

  beforeDestroy: function () {
    if (this.formatType === 'timeago' && this.interval) {
      clearInterval(this.interval);
    }
  },

  watch: {
    at: function () {
      // Render to account for after-mount programmatic changes to `at`.
      if (this.formatType === 'timeago') {
        this._formatTimeago();
      } else if (this.formatType === 'calendar') {
        this._formatCalender();
      } else {
        throw new Error();
      }
    },
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    _formatCalender: function () {
      this.formattedTimestamp = $lycaon.formatter.formatCalender(this.at, this.short);
      if (_.isFunction(this.translator)) {
        this.formattedTimestamp = this.translator(this.formattedTimestamp, this.transOption);
      }
    },
    _formatTimeago: function () {
      var results = $lycaon.formatter.formatTimeago(this.at, this.short);
      this.formattedTimestamp = results.value;
      if (_.isFunction(this.translator)) {
        this.formattedTimestamp = this.translator(this.formattedTimestamp, this.transOption);
      }

      // Clear the interval as it no longer needs to be updated.
      // 生かしておけばタイムゾーンが変更されれば自動的に現地時間になるが
      // ページを永遠に開き続けて何もしないのは稀な行為と判断しての処理
      if (!results.state && this.interval) {
        clearInterval(this.interval);
      }
    },
  },
});
