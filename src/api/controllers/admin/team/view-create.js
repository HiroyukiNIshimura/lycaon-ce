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
      viewTemplatePath: 'pages/admin/team/create',
    },
  },

  fn: async function () {
    var response = {};
    response.users = await User.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });
    response.users.push(await User.findOne({ emailAddress: 'lycaonbot@example.com' }));

    response.categories = await Category.find({ organization: this.req.organization.id });

    if (!(await sails.helpers.planingTeam.with({ organization: this.req.organization.id }))) {
      response.unplanned = true;
    }
    return response;
  },
};
