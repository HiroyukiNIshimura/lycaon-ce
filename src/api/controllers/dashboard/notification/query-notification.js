module.exports = {
  friendlyName: 'query list',

  description: 'Query "List" page.',

  inputs: {
    page: {
      type: 'number',
      required: true,
      description: 'For thread paginate',
    },
  },
  exits: {
    success: {
      description: 'Query threads successfully.',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });
    response.pagination = pagination;

    var dt = new Date();
    dt.setDate(dt.getDate() + 1);
    dt.setHours(0, 0, 0, 0);

    var whereClause = {
      deleted: false,
      postingAt: { '<': dt.valueOf() },
    };

    response.records = await SysNotification.count(whereClause);
    response.data = await SysNotification.find({
      where: whereClause,
      sort: [{ postingAt: 'DESC' }, { id: 'DESC' }],
      limit: pagination.limit,
      skip: pagination.skip,
    }).populate('users', { where: { id: this.req.me.id } });

    for (let notify of response.data) {
      if (notify.users.length > 0) {
        notify.isNotRead = true;
      }
      delete notify.users;
    }

    return response;
  },
};
