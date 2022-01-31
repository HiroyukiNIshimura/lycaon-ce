module.exports = {
  friendlyName: 'Query activities',
  description: 'Query activities.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
    },
    nonmyown: {
      type: 'boolean',
    },
    activtyOwner: {
      type: 'number',
      description: 'owner.id',
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

    var NATIVE_COUNT_SQL = `
SELECT COUNT("thread_activity".*)
  FROM "public"."thread_activity" as "thread_activity"
  LEFT OUTER JOIN "thread" as "thread__thread"
    ON "thread__thread"."id" = "thread_activity"."thread"
`;

    var NATIVE_WHERE_TEAM_SQL = `
 WHERE
    "thread_activity"."team" IN (
        SELECT a."team_users"
          FROM "team_users__user_teams" a
         WHERE a."user_teams" = $1
    )
    AND "thread_activity"."team" IN (
        SELECT g."id"
        FROM "team" g
        WHERE g."deleted" = false
    )
    AND (
        "thread__thread"."local" = false
        OR (
            "thread__thread"."local" = true
            AND "thread__thread"."owner" = $2
        )
    )
`;

    var NATIVE_WHERE_TEAM_NONMYOWN_SQL = `
 WHERE
    "thread_activity"."team" IN (
        SELECT a."team_users"
          FROM "team_users__user_teams" a
         WHERE a."user_teams" = $1
    )
    AND "thread_activity"."team" IN (
        SELECT g."id"
        FROM "team" g
        WHERE g."deleted" = false
    )
    AND "thread_activity"."user" != $2
`;

    var NATIVE_WHERE_MAIN_SQL = `
 WHERE
    "thread_activity"."team" = $1
   AND (
        "thread__thread"."local" = false
        OR (
            "thread__thread"."local" = true
            AND "thread__thread"."owner" = $2
        )
    )
`;

    var NATIVE_WHERE_MAIN_NONMYOWN_SQL = `
 WHERE "thread_activity"."team" = $1
   AND "thread_activity"."user" != $2
`;

    var NATIVE_WHERE_MAIN_OTHEROWNER_SQL = `
 WHERE "thread_activity"."team" = $1
   AND "thread_activity"."user" = $2
`;

    var rawResult = {};
    var pagingParameter = [pagination.limit, pagination.skip];

    try {
      if (inputs.id) {
        let bindParameters = [inputs.id, this.req.me.id];
        let where = NATIVE_WHERE_MAIN_SQL;

        if (inputs.nonmyown) {
          if (inputs.activtyOwner) {
            where = NATIVE_WHERE_MAIN_OTHEROWNER_SQL;
            bindParameters = [inputs.id, inputs.activtyOwner];
          } else {
            where = NATIVE_WHERE_MAIN_NONMYOWN_SQL;
            bindParameters = [inputs.id, this.req.me.id];
          }
        }

        rawResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL + where, bindParameters);
        response.records = rawResult.rows[0].count;

        bindParameters = [...bindParameters, ...pagingParameter];
        response.data = await sails.helpers.storage.activityQuery.with({
          where: (where += `
ORDER BY "updatedAt" DESC, "id" DESC
LIMIT $3 OFFSET $4`),
          bindParameters: bindParameters,
        });
      } else {
        let where = NATIVE_WHERE_TEAM_SQL;
        if (inputs.nonmyown) {
          where = NATIVE_WHERE_TEAM_NONMYOWN_SQL;
        }

        rawResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL + where, [this.req.me.id, this.req.me.id]);
        response.records = rawResult.rows[0].count;

        response.data = await sails.helpers.storage.activityQuery.with({
          where:
            where +
            `
ORDER BY "updatedAt" DESC, "id" DESC
LIMIT $3 OFFSET $4`,
          bindParameters: [this.req.me.id, this.req.me.id, pagination.limit, pagination.skip],
        });
      }

      //
      for (const entry of response.data) {
        if (entry.sneeze) {
          let sneezes = await Sneeze.find({ where: { thread: entry.thread.id }, sort: 'id ASC' });

          entry.sneezeNo =
            _.findIndex(sneezes, (o) => {
              return o.id === entry.sneeze;
            }) + 1;

          if (entry.reply) {
            let replys = await Reply.find({
              where: { sneeze: entry.sneeze, thread: entry.thread.id },
              sort: 'id ASC',
            });

            entry.replyNo =
              _.findIndex(replys, (o) => {
                return o.id === entry.reply;
              }) + 1;
          }
        }
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
