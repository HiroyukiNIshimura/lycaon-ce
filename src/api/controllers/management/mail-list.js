module.exports = {
  friendlyName: 'Get mail-address list for Backoffice API',
  description: 'Get mail-address list for Backoffice API.',

  inputs: {
    page: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: 200,
    });
    response.pagination = pagination;

    var list = await User.find({
      where: { deleted: false, isSandbox: false, isNologin: false },
      sort: 'id ASC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    response.mails = list.map((o) => {
      return o.emailAddress;
    });

    return response;
  },
};
