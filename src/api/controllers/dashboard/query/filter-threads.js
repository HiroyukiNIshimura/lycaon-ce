module.exports = {
  friendlyName: 'Filter threads',
  description: 'Filter threads.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
    },
    filterWorking: {
      type: 'boolean',
    },
    filterUnassigned: {
      type: 'boolean',
    },
    filterExpired: {
      type: 'boolean',
    },
    sort: {
      type: 'number',
      description: 'sort column',
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
      local: false,
    };

    try {
      if (inputs.filterWorking || inputs.filterExpired || inputs.filterUnassigned) {
        whereClause.or = [];
        if (inputs.filterWorking) {
          whereClause.or.push({ working: true });
        }
        if (inputs.filterExpired) {
          whereClause.or.push({ dueDateAt: { '<': Date.now() } });
        }
        if (inputs.filterUnassigned) {
          whereClause.or.push({ responsible: null });
        }
      }

      var sort = [{ lastHumanUpdateAt: 'DESC' }, { id: 'ASC' }];
      if (inputs.sort) {
        switch (inputs.sort) {
          case 1:
            sort = [{ lastHumanUpdateAt: 'ASC' }, { id: 'ASC' }];
            break;
          case 2:
            sort = [{ createdAt: 'DESC' }, { id: 'ASC' }];
            break;
          case 3:
            sort = [{ createdAt: 'ASC' }, { id: 'ASC' }];
            break;
          case 4:
            sort = [{ priority: 'DESC' }, { id: 'ASC' }];
            whereClause.priority = { '!=': null };
            break;
          case 5:
            sort = [{ priority: 'ASC' }, { id: 'ASC' }];
            whereClause.priority = { '!=': null };
            break;
          case 6:
            sort = [{ dueDateAt: 'DESC' }, { id: 'ASC' }];
            whereClause.dueDateAt = { '!=': null };
            break;
          case 7:
            sort = [{ dueDateAt: 'ASC' }, { id: 'ASC' }];
            whereClause.dueDateAt = { '!=': null };
            break;
          case 8:
            sort = [{ urgency: 'DESC' }, { id: 'ASC' }];
            whereClause.priority = { '!=': null };
            break;
          case 9:
            sort = [{ urgency: 'ASC' }, { id: 'ASC' }];
            whereClause.priority = { '!=': null };
            break;
          case 0:
          default:
            sort = [{ lastHumanUpdateAt: 'DESC' }, { id: 'ASC' }];
            break;
        }
      }

      response.records = await Thread.count().where(whereClause);
      response.data = await sails.helpers.storage.findThread.with({
        whereClause: whereClause,
        sort: sort,
        pagination: pagination,
        user: this.req.me,
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
