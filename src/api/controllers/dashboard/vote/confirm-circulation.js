module.exports = {
  friendlyName: 'confirm circulation',

  description: 'confirm circulation.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
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
    notConfirmNotReleased: {
      statusCode: 409,
      description: 'Not Released.',
    },
    notConfirmPassedDeadline: {
      statusCode: 409,
      description: 'Passed Deadline.',
    },
  },

  fn: async function (inputs) {
    var current = await Vote.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
      isQuestionnaireFormat: false,
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
      throw 'notConfirmNotReleased';
    }
    if (current.circulationTo < dt.valueOf()) {
      throw 'notConfirmPassedDeadline';
    }

    var valuesToSet = {
      vote: current.id,
      voteChoices: current.choices[0].id,
      user: this.req.me.id,
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        await VoteAnswer.create(valuesToSet).usingConnection(db);
      });

      this.req.session.effectMessage = sails.__(
        'You have confirmed viewing the circulation notice'
      );
      return {
        id: current.id,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
