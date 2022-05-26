module.exports = {
  friendlyName: 'create answer',

  description: 'create answer.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
    },
    answers: {
      type: 'json',
      description: `voteChoices.id's array`,
    },
    otherId: {
      type: 'number',
      description: 'voteChoices.id',
    },
    otherToken: {
      type: 'string',
      description: 'その他の回答',
      custom: function (value) {
        return [...value].length <= 500;
      },
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a vote that has not joined.',
    },
    alreadyAnswerd: {
      statusCode: 409,
      description: 'Already answered.',
    },
    notAnswerNotReleased: {
      statusCode: 409,
      description: 'Not Released.',
    },
    notAnswerPassedDeadline: {
      statusCode: 409,
      description: 'Passed Deadline.',
    },
  },

  fn: async function (inputs) {
    var current = await Vote.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
      isQuestionnaireFormat: true,
    })
      .populate('users', { where: { id: this.req.me.id } })
      .populate('choices')
      .populate('answers', { where: { user: this.req.me.id } });

    if (!current) {
      throw 'notFound';
    }

    if (current.users.length < 0) {
      throw 'notFound';
    }

    if (current.answers.length > 0) {
      throw 'alreadyAnswerd';
    }

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    if (current.circulationFrom > dt.valueOf()) {
      throw 'notAnswerNotReleased';
    }
    if (current.circulationTo < dt.valueOf()) {
      throw 'notConfirmPassedDeadline';
    }

    var valuesToSets = [];

    for (let choice of inputs.answers) {
      var valuesToSet = {
        vote: current.id,
        voteChoices: choice,
        user: this.req.me.id,
      };

      if (current.hasOther && inputs.otherId && inputs.otherId === choice) {
        valuesToSet.otherToken = inputs.otherToken;
      }

      valuesToSets.push(valuesToSet);
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await VoteAnswer.createEach(valuesToSets).usingConnection(db);
      });

      //回答が出そろったか確認
      var updated = await Vote.findOne({
        id: inputs.id,
        organization: this.req.organization.id,
        isQuestionnaireFormat: true,
      })
        .populate('users')
        .populate('choices')
        .populate('answers');

      for (let user of updated.users) {
        if (_.find(updated.answers, (o) => {
          return o.user === user.id;
        })) {
          user.alreadyAnswered = true;
        }
      }

      if (_.every(updated.users, 'alreadyAnswered')) {
        //アンケートの回答が出そろった
        for (let entry of updated.users) {
          var data = await sails.helpers.mail.createVoteAnseweredMail.with({
            organization: this.req.me.organization,
            vote: updated,
            user: entry,
          });

          await sails.helpers.agendaSchedule.with({
            ttl: Date.now() + sails.config.custom.mailSendTTL,
            job: 'send-email',
            data: data,
          });
        }
      }
      //メール配信データ作成時にsails.hooks.i18n.localeが変更されているので
      sails.hooks.i18n.setLocale(this.req.me.languagePreference);

      this.req.session.effectMessage = sails.__('The answer to the question has been confirmed');
      return {
        id: current.id,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
