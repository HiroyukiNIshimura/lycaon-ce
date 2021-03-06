module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',

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
      viewTemplatePath: 'pages/admin/category/list',
    },
  },

  fn: async function () {
    var response = {};

    response.categories = await Category.find({
      where: { organization: this.req.organization.id },
      sort: 'displayOrder ASC',
    });

    response.deletePin = await sails.helpers.genPin();

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return await sails.helpers.compact(response);
  },
};
