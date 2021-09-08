module.exports = {
  friendlyName: 'Query buzz threads',
  description: 'Query buzz threads.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
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

    var whereClause;

    if (inputs.id) {
      var team = await sails.helpers.validateMembership.with({
        id: inputs.id,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }

      whereClause = {
        team: inputs.id,
        accessCount: { '>': 0 },
      };
    } else {
      whereClause = {
        team: {
          in: user.teams.map((o) => {
            return o.id;
          }),
        },
        accessCount: { '>': 0 },
      };
    }

    whereClause.status = 0;

    try {
      response.records = await Thread.count().where(whereClause);
      response.data = await sails.helpers.storage.findThread.with({
        whereClause: whereClause,
        sort: [{ accessCount: 'DESC' }, { id: 'ASC' }],
        pagination: pagination,
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
