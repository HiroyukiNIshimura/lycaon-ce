module.exports = {
  friendlyName: 'update answer',

  description: 'update answer.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
    },
    answers: {
      type: 'ref',
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
    notAnswerNotReleased: {
      statusCode: 409,
      description: 'not Released.',
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
        await VoteAnswer.destroy({ vote: current.id, user: this.req.me.id }).usingConnection(db);
        await VoteAnswer.createEach(valuesToSets).usingConnection(db);
      });

      this.req.session.effectMessage = sails.__('The answer to the question has been updated');
      return {
        id: current.id,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
