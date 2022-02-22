module.exports = {
  friendlyName: 'View sort',

  description: 'Display "Sort" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    team: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/milestone/sort',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a milestone that has not joined.',
    },
  },

  fn: async function (inputs) {
    var team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var response = { team: team };

    response.milestone = await Milestone.find({
      where: { team: inputs.team },
      sort: 'lineNo ASC',
    }).populate('user');

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    return await sails.helpers.compact(response);
  },
};
