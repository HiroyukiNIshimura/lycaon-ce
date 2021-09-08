module.exports = {
  friendlyName: 'View view',

  description: 'Display "View" page.',
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
      viewTemplatePath: 'pages/dashboard/milestone/view',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
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

    var line = 1;
    for (let entity of response.milestone) {
      entity.openQty = await Thread.count({ milestone: entity.id, status: 0, local: false });
      entity.closedQty = await Thread.count({ milestone: entity.id, status: 1, local: false });
      entity.viewLineNo = line;
      line++;
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
