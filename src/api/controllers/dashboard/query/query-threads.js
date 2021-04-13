module.exports = {
  friendlyName: 'Query threads',
  description: 'Query threads.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
    },
    responsible: {
      type: 'number',
      description: 'responsible: User.id',
    },
    concept: {
      type: 'number',
      description: 'concept',
    },
    category: {
      type: 'number',
      description: 'category.id',
    },
    status: {
      type: 'number',
      description: 'status',
    },
    owner: {
      type: 'number',
      description: 'owner: User.id',
    },
    milestone: {
      type: 'number',
      description: 'milestone.id',
    },
    local: {
      type: 'boolean',
      description: 'local | not local',
    },
    flag: {
      type: 'boolean',
      description: 'fan | not fan',
    },
    working: {
      type: 'boolean',
      description: 'working | not working',
    },
    locked: {
      type: 'number',
    },
    priority: {
      type: 'number',
    },
    tags: {
      type: 'ref',
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
        local: false,
      };
    } else {
      whereClause = {
        team: {
          in: user.teams.map((o) => {
            return o.id;
          }),
        },
        local: false,
      };
    }

    try {
      if (inputs.local) {
        whereClause.local = true;
        whereClause.owner = this.req.me.id;
      } else {
        if (inputs.owner != undefined) {
          whereClause.owner = inputs.owner;
        }
      }

      if (inputs.concept != undefined) {
        whereClause.concept = inputs.concept;
      }
      if (inputs.responsible != undefined) {
        whereClause.responsible = inputs.responsible;
      }
      if (inputs.milestone != undefined) {
        whereClause.milestone = inputs.milestone;
      }
      if (inputs.category != undefined) {
        whereClause.category = inputs.category;
      }
      if (inputs.status != undefined) {
        whereClause.status = inputs.status;
      }
      if (inputs.priority != undefined) {
        whereClause.priority = inputs.priority;
      }

      if (inputs.locked != undefined) {
        if (inputs.locked === 0) {
          whereClause.locked = { '!=': true };
        } else {
          whereClause.locked = true;
        }
      }

      if (inputs.working) {
        whereClause.working = true;
      }

      if (inputs.flag) {
        var user = await User.findOne({
          id: this.req.me.id,
        }).populate('flags', { where: { team: inputs.id } });
        if (user.flags.length > 0) {
          whereClause.id = user.flags.map((o) => {
            return o.id;
          });
        }
      }

      if (inputs.tags) {
        whereClause.or = [];
        _.each(inputs.tags, (entry) => {
          whereClause.or.push({ tagToken: { contains: entry.id + ':' } });
        });
      }

      var sort = 'updatedAt DESC';
      if (inputs.sort) {
        switch (inputs.sort) {
          case 1:
            sort = 'updatedAt ASC';
            break;
          case 2:
            sort = 'createdAt DESC';
            break;
          case 3:
            sort = 'createdAt ASC';
            break;
          case 4:
            sort = 'priority DESC';
            whereClause.priority = { '!=': null };
            break;
          case 5:
            sort = 'priority ASC';
            whereClause.priority = { '!=': null };
            break;
          case 6:
            sort = 'dueDateAt DESC';
            whereClause.dueDateAt = { '!=': null };
            break;
          case 7:
            sort = 'dueDateAt ASC';
            whereClause.dueDateAt = { '!=': null };
            break;
          case 8:
            sort = 'urgency DESC';
            whereClause.priority = { '!=': null };
            break;
          case 9:
            sort = 'urgency ASC';
            whereClause.priority = { '!=': null };
            break;
          case 0:
          default:
            sort = 'updatedAt DESC';
            break;
        }
      }

      response.records = await Thread.count().where(whereClause);
      response.data = await sails.helpers.findThread.with({
        whereClause: whereClause,
        sort: sort,
        pagination: pagination,
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
