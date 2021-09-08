module.exports = {
  friendlyName: 'View edit',

  description: 'Display "Edit" page.',
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
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/milestone/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};
    response.milestone = await Milestone.findOne({
      id: inputs.id,
    });
    if (!response.milestone) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: response.milestone.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    //コンボ用
    response.team = await Team.findOne({ id: response.milestone.team }).populate('users', {
      sort: 'lastSeenAt DESC',
    });

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
