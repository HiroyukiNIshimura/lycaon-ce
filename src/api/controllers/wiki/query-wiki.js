module.exports = {
  friendlyName: 'Query wikis',
  description: 'Query wikis.',
  inputs: {
    team: {
      type: 'number',
      description: 'team.id',
    },
    tags: {
      type: 'ref',
    },
    isFlags: {
      type: 'boolean',
    },
    page: {
      type: 'number',
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

    var user = await User.findOne({
      id: this.req.me.id,
    })
      .populate('teams', { where: { deleted: false }, sort: 'id ASC' })
      .populate('wikiflags');
    if (user.teams.length < 1) {
      return response;
    }

    var whereClause;

    if (inputs.team) {
      var team = await sails.helpers.validateMembership.with({
        id: inputs.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }

      whereClause = {
        team: inputs.team,
      };
    } else {
      whereClause = {
        team: {
          in: user.teams.map((o) => {
            return o.id;
          }),
        },
      };
    }

    if (inputs.isFlags) {
      whereClause.id = {
        in: user.wikiflags.map((o) => {
          return o.id;
        }),
      };
    }

    if (inputs.tags) {
      whereClause.or = [];
      _.each(inputs.tags, (entry) => {
        whereClause.or.push({ tagToken: { contains: entry.id + ':' } });
      });
    }

    whereClause.concept = 0;
    whereClause.deleted = false;

    try {
      response.records = await Wiki.count().where(whereClause);
      response.data = await Wiki.find({
        where: whereClause,
        sort: [{ createdAt: 'DESC' }, { id: 'ASC' }],
        limit: pagination.limit,
        skip: pagination.skip,
      })
        .populate('items')
        .populate('tags', {
          sort: 'name',
        })
        .populate('team')
        .populate('owner')
        .populate('lastUpdateUser')
        .populate('fans', { where: { id: this.req.me.id } });

      for (let entry of response.data) {
        await User.setGravatarUrl(entry.owner, 36);
        await User.setGravatarUrl(entry.lastUpdateUser, 36);

        entry.sanitizeHtml = await sails.helpers.sanitizeDescription.with({
          markdown: entry.body,
          max: 200,
        });
        delete entry.body;
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
