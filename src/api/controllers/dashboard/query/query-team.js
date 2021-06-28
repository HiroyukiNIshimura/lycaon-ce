module.exports = {
  friendlyName: 'Query teams',
  description: 'Query teams.',
  inputs: {
    page: {
      type: 'number',
      description: 'For team paginate',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Query team successfully.',
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
      .populate('teams', {
        where: { deleted: false },
        sort: 'id ASC',
        limit: pagination.limit,
        skip: pagination.skip,
      })
      .populate('flags');

    if (user.teams.length < 1) {
      return response;
    }

    var NATIVE_COUNT_SQL = `
select count("team__teams"."id") as qty
  from "public"."team_users__user_teams" as "team_users__user_teams__teams" 
  left outer join "team" as "team__teams" on "team_users__user_teams__teams"."team_users" = "team__teams"."id" 
 where "team__teams"."deleted" = false
   and "team_users__user_teams__teams"."user_teams" = $1
`;

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    for (let team of user.teams) {
      team.summary = {
        total: await Thread.count().where({ team: team.id, local: false }),
        open: await Thread.count().where({ team: team.id, status: 0, local: false }),
        working: await Thread.count().where({
          team: team.id,
          status: 0,
          working: true,
          local: false,
        }),
        expired: await Thread.count().where({
          team: team.id,
          status: 0,
          dueDateAt: { '<': dt.valueOf() },
          local: false,
        }),
        notAssignment: await Thread.count().where({
          team: team.id,
          status: 0,
          responsible: null,
          local: false,
        }),
      };
    }

    response.data = user.teams;

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL, [this.req.me.id]);
      response.records = rawResult.rows[0].qty;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
