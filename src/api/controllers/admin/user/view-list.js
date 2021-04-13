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
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/user/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.adminGridRowPerPage,
    });
    response.pagination = pagination;

    response.records = await User.count({ organization: this.req.organization.id });
    response.users = await User.find({
      where: { organization: this.req.organization.id },
      sort: 'fullName ASC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    for (let entry of response.users) {
      await User.setGravatarUrl(entry);
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
