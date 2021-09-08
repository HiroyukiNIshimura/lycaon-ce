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
      description: 'team.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/vote/create',
    },
  },

  fn: async function (inputs) {
    var response = {};
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
    // eslint-disable-next-line camelcase
    response.teamUsers = await sails.models['team_users__user_teams'].find({ team_users: teams });

    if (inputs.team) {
      response.currentTeam = inputs.team;
    }

    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
