module.exports = {
  friendlyName: 'View answer',

  description: 'Display "Answer" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/vote/answer',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a vote that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.vote = await Vote.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
      isQuestionnaireFormat: true,
    })
      .populate('author')
      .populate('users', { where: { id: this.req.me.id } })
      .populate('choices')
      .populate('answers', { where: { user: this.req.me.id } });

    if (!response.vote) {
      throw 'notFound';
    }

    if (response.vote.users.length < 0) {
      throw 'notFound';
    }

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    if (response.vote.circulationFrom > dt.valueOf()) {
      throw 'notFound';
    }
    if (response.vote.circulationTo < dt.valueOf()) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.vote.author, 36);

    return response;
  },
};
