module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',

  inputs: {
    page: {
      type: 'number',
      description: 'For paginate',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/jobs/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.cheetahGridRowPerPage,
    });
    response.pagination = pagination;

    var where = { result: ['error', 'failure'] };

    response.records = await JobLog.count(where);
    response.logs = await JobLog.find({
      where: where,
      sort: 'createdAt DESC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    return response;
  },
};
