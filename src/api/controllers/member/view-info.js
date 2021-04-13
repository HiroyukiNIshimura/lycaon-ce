module.exports = {
  friendlyName: 'View info',

  description: 'Display "Info" page.',
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
      description: 'user.id',
    },
    tab: {
      type: 'string',
      isIn: ['', 'tab-info', 'tab-message', 'tab-monthly', 'tab-daily', 'tab-weekly'],
      defaultsTo: '',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/member/info',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.user = await User.findOne({ id: inputs.id, deleted: false })
      .populate('teams', {
        where: { deleted: false },
        sort: 'id ASC',
      })
      .populate('organization');

    if (!response.user) {
      throw 'notFound';
    }
    if (
      response.user.organization &&
      response.user.organization.id !== this.req.me.organization.id
    ) {
      throw 'notFound';
    }
    if (inputs.handleId !== this.req.me.organization.handleId) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.user, 36);

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    response.tab = inputs.tab;

    return response;
  },
};
