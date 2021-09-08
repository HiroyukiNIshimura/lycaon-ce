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
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/user/create',
    },
  },

  fn: async function () {
    var response = {};
    response.teams = await Team.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });

    if (!(await sails.helpers.planing.planingUser.with({ organization: this.req.organization.id }))) {
      response.unplanned = true;
    }

    return response;
  },
};
