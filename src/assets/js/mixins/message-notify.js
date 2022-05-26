/* eslint-disable */
const messageNotify = {
  data: function () {
    return {
      messageStack: [],
    };
  },
  mounted: function () {
    var self = this;
    io.socket.on('message-notify', (response) => {
      if (response.data.sendTo === self.me.id) {
        self.stackMessage(response);
        $lycaon.socketToast(response.message);
      }
    });

    io.socket.on('message-read', (response) => {
      if (response.reader.id === SAILS_LOCALS.me.id) {
        this.removeStack(response.data.id);
      }
    });

    this.stackMessage(false);
  },
  methods: {
    stackMessage: function (data) {
      if (data && data.data) {
        this.messageStack.push(data);
        if (this.messageStack.length > 30) {
          this.messageStack.shift();
        }
      }

      $('#stack-message-list').empty();
      var self = this;
      var i = 0;
      _.each(this.messageStack, (entry) => {
        var ref = `/${this.me.organization.handleId}/member/${entry.data.sendFrom.id}?tab=tab-message`;

        if (i > 0) {
          $('#stack-message-list').append('<div class="dropdown-divider msg-id-${entry.data.id}"></div>');
        }
        $('#stack-message-list').append(
          `<a class="dropdown-item text-wrap waves-effect waves-light msg-id-${entry.data.id}" href="${ref}">${self.i18n(
            entry.message.key,
            entry.message.params
          )} (${$lycaon.formatter.dateAgo(entry.data.createdAt)})</a>`
        );
        i++;
      });

      if (this.messageStack.length > 0) {
        $('#stack-message').show();
      } else {
        $('#stack-message').hide();
      }
    },
    removeStack: function (id) {
      this.messageStack = _.filter(this.messageStack, (o) => {
        return o.data.id !== id;
      })
      this.stackMessage(false);
    }
  },
  computed: {
    //
  },
};
