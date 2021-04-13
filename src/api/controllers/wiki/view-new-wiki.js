module.exports = {
  friendlyName: 'View new wiki',

  description: 'Display "New wiki" page.',
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
      description: 'team.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/wiki/new-wiki',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    return response;
  },
};
