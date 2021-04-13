module.exports = {
  friendlyName: 'View git show page',
  description: 'Display the dashboard git show page.',
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
      description: 'GitLog.id',
      required: true,
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/git-show',
      description: 'Display the main page for users.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var gitlog = await GitLog.findOne({
      id: inputs.id,
    }).populate('team');
    if (!gitlog || !gitlog.team) {
      throw 'notFound';
    }

    var response = await sails.helpers.parseGitShow.with({ gitlog: gitlog });

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
