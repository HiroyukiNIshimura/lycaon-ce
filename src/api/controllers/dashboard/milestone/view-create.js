module.exports = {
  friendlyName: 'View create',

  description: 'Display "Create" page.',
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
      viewTemplatePath: 'pages/dashboard/milestone/create',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    //コンボ用
    response.team = await Team.findOne({ id: inputs.team }).populate('users', {
      sort: 'lastSeenAt DESC',
    });

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    return response;
  },
};
