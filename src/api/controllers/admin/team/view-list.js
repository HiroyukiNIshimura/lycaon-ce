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
      viewTemplatePath: 'pages/admin/team/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.adminGridRowPerPage,
    });
    response.pagination = pagination;

    response.records = await Team.count({ organization: this.req.organization.id });
    response.teams = await Team.find({
      where: { organization: this.req.organization.id },
      sort: 'id ASC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
