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
      description: 'team.id',
      required: true,
    },
    sha: {
      type: 'string',
      required: true,
      description: 'git.hash',
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
      team: inputs.id,
      hash: inputs.sha,
    }).populate('team');
    if (!gitlog || !gitlog.team) {
      throw 'notFound';
    }

    var response = {};

    if (gitlog.team.connectType === 0) {
      response = await sails.helpers.git.githubShow.with({ gitlog: gitlog, me: this.req.me });
    } else {
      response = await sails.helpers.git.gitlabShow.with({ gitlog: gitlog, me: this.req.me });
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return await sails.helpers.compact(response);
  },
};
