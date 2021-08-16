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
          $('#stack-message-list').append('<div class="dropdown-divider"></div>');
        }
        $('#stack-message-list').append(
          `<a class="dropdown-item text-wrap waves-effect waves-light" href="${ref}">${self.i18n(
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
  },
  computed: {
    //
  },
};
