module.exports = {
  friendlyName: 'Find messages',

  description: 'Find messages.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'user.id',
    },
    page: {
      type: 'number',
      description: 'For paginate',
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    if (inputs.id === this.req.me.id) {
      return response;
    }

    response.user = await User.findOne({ id: inputs.id, deleted: false });
    if (!response.user) {
      throw 'notFound';
    }
    if (response.user.organization !== this.req.me.organization.id) {
      throw 'notFound';
    }

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.messageGridRowPerPage,
    });
    response.pagination = pagination;

    var whereClause = {
      or: [
        { sendTo: this.req.me.id, sendFrom: response.user.id },
        { sendTo: response.user.id, sendFrom: this.req.me.id },
      ],
    };

    response.records = await Message.count().where(whereClause);
    response.data = await Message.find({
      where: whereClause,
      sort: 'createdAt DESC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    return response;
  },
};
