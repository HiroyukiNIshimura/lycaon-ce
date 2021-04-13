module.exports = {
  friendlyName: 'Query git log threads',
  description: 'Query git log threads.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
      required: true,
    },
    page: {
      type: 'number',
      description: 'For thread paginate',
      required: true,
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

    var user = await User.findOne({
      id: this.req.me.id,
    }).populate('teams', { where: { deleted: false }, sort: 'id ASC' });
    if (user.teams.length < 1) {
      return response;
    }

    var team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var whereClause = {
      team: inputs.id,
    };

    try {
      response.records = await GitLog.count().where(whereClause);
      response.data = await GitLog.find({
        where: whereClause,
        sort: 'id DESC',
        limit: pagination.limit,
        skip: pagination.skip,
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
