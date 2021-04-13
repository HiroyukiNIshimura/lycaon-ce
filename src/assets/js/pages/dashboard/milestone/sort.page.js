parasails.registerPage('milestone-sort', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    milestone: [],
    inDrag: false,
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
  components: {
    draggable: draggable,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    var self = this;
    io.socket.on('message-notify', function (response) {
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
    onChanged: function (e) {
      if (e.moved) {
        _.each(this.milestone, (entry, index) => {
          entry.lineNo = index + 1;
        });

        var form = _.find(this.$children, {
          $el: $('#update-order-form')[0],
        });
        form.submit();
      }
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.milestone = response.milestones;

      $lycaon.successToast('Changed the display order of milestones');
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = {
        orderSet: [],
      };
      _.each(this.milestone, (entry) => {
        argins.orderSet.push({
          id: entry.id,
          lineNo: entry.lineNo,
          team: entry.team,
        });
      });

      // Validate
      if (Object.keys(this.formErrors).length > 0) {
        $lycaon.errorToast('There is an error in the input value');
        return;
      }

      return argins;
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        team: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    backToUrl: function () {
      return `/${this.organization.handleId}/milestone/${this.team.id}`;
    },
  },
});
