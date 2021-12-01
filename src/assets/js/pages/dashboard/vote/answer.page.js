parasails.registerPage('vote-answer', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    formatDate: $lycaon.formatter.formatDate,
    isEditMode: false,
    singleAnswer: -1,
    multipleAnswer: [],
    other: '',
    otherChoice: {},
    popStatus: {},

    //…
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      isQuestionnaireFormat: false,

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
    if (this.vote.answers.length > 0) {
      this.isEditMode = true;

      if (this.vote.multipleAnswers) {
        this.multipleAnswer = this.vote.answers.map((o) => {
          return o.voteChoices;
        });
      } else {
        this.singleAnswer = this.vote.answers[0].voteChoices;
      }
    }

    if (this.vote.hasOther) {
      this.otherChoice = _.find(this.vote.choices, { isOther: true });
      if (this.otherChoice) {
        var answer = _.find(this.vote.answers, { voteChoices: this.otherChoice.id });
        if (answer) {
          this.other = answer.otherToken;
        }
      }
    }
  },
  mounted: async function () {
    //…
    var self = this;
    $('body').on('click', (e) => {
      if ($('.user-avater-icon').has(e.target).length > 0) {
      } else {
        self.popStatus = '';
      }
    });
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    onIdentityIconClick: function (popInfo) {
      this.popStatus = popInfo.id;
    },
    getCheckBoxId: function (index) {
      return `vote-multiple-checkbox-${index}`;
    },
    getRadioId: function (index) {
      return `vote-multiple-radio-${index}`;
    },
    submitAnswer: function () {
      var form = _.find(this.$children, {
        $el: $('#create-answer')[0],
      });
      if (this.isEditMode) {
        form = _.find(this.$children, {
          $el: $('#update-answer')[0],
        });
      }
      form.submit();
    },
    submittedForm: async function (response) {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/${this.organization.handleId}/vote/${response.id}`;
    },
    handleParsingForm: function () {
      //
      var argins = { id: this.vote.id };

      if (this.vote.multipleAnswers) {
        if (this.multipleAnswer.length < 1) {
          $lycaon.errorToast('Please select at least one answer');
          return;
        }
        argins.answers = this.multipleAnswer;
      } else {
        if (this.singleAnswer === -1) {
          $lycaon.errorToast('Please select at least one answer');
          return;
        }
        argins.answers = [this.singleAnswer];
      }

      if (this.vote.hasOther && this.otherChoice) {
        argins.otherToken = this.other;
        argins.otherId = this.otherChoice.id;
      }

      return argins;
    },
  },
  computed: {
    returnLink: function () {
      return `/${this.organization.handleId}/vote/${this.vote.id}`;
    },
    answeredAt: function () {
      if (this.vote.answers.length > 0) {
        return this.formatDate(this.vote.answers[0].createdAt);
      }
      return '';
    },
    otherEnabled: function () {
      if (this.vote.hasOther) {
        if (this.vote.multipleAnswers) {
          return this.multipleAnswer.indexOf(this.otherChoice.id) > -1;
        } else {
          return this.singleAnswer === this.otherChoice.id;
        }
      }
      return false;
    },
  },
});
