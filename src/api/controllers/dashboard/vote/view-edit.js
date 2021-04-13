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
      description: 'vote.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/vote/edit',
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
    })
      .populate('users')
      .populate('author')
      .populate('choices')
      .populate('answers');

    if (!response.vote) {
      throw 'notFound';
    }

    response.vote.items = await VoteItem.find({
      where: {
        vote: response.vote.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');

    for (let item of response.vote.items) {
      await User.setGravatarUrl(item.owner, 36);
    }

    response.teams = await Team.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });
    response.users = await User.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });

    var teams = response.teams.map((o) => {
      return o.id;
    });
    response.teamUsers = await sails.models['team_users__user_teams'].find({ team_users: teams });

    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
