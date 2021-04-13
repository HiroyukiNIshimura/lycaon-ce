module.exports = {
  friendlyName: 'Query available votes',
  description: 'Query available votes.',
  inputs: {
    voteState: {
      type: 'number',
      isIn: [0, 1, 2, 3],
      defaultsTo: 0,
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
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });
    response.pagination = pagination;

    var COUNT_SQL = `
SELECT COUNT("vote".*) as "qty"
  FROM "vote"
    `;

    var SELECT_SQL = `
SELECT "vote".*
  FROM "vote"
    `;

    var NATIVE_NEW_WHERE = `WHERE "vote"."organization" = $1
   AND "vote"."circulationFrom" <= $2
   AND "vote"."circulationTo" >= $3
   AND "vote"."id" IN (SELECT "vote_users" FROM "user_votes__vote_users" WHERE "user_votes" = $4)
   AND "vote"."id" NOT IN (SELECT "vote_choices"."vote" FROM "vote_choices" WHERE "vote_choices"."id" 
                        IN (SELECT "vote_answer"."voteChoices" FROM "vote_answer" WHERE "vote_answer"."user" = $5))
`;

    var NATIVE_OPEN_WHERE = `WHERE "vote"."organization" = $1
   AND "vote"."circulationFrom" <= $2
   AND "vote"."circulationTo" >= $3
   AND "vote"."id" IN (SELECT "vote_users" FROM "user_votes__vote_users" WHERE "user_votes" = $4)
   AND "vote"."id" IN (SELECT "vote_choices"."vote" FROM "vote_choices" WHERE "vote_choices"."id" 
                        IN (SELECT "vote_answer"."voteChoices" FROM "vote_answer" WHERE "vote_answer"."user" = $5))
`;

    var NATIVE_CLOSED_WHERE = `WHERE "vote"."organization" = $1
   AND "vote"."circulationTo" < $2
   AND "vote"."id" IN (SELECT "vote_users" FROM "user_votes__vote_users" WHERE "user_votes" = $3)
`;

    var NATIVE_MY_WHERE = `WHERE "vote"."organization" = $1
AND "vote"."author" = $2
`;

    var OEDER_OPEN = `ORDER BY "vote"."circulationFrom" ASC, "vote"."circulationTo" ASC
LIMIT $6 OFFSET $7
`;
    var OEDER_CLOSED = `ORDER BY "vote"."circulationFrom" ASC, "vote"."circulationTo" ASC
LIMIT $4 OFFSET $5
`;
    var OEDER_MY = `ORDER BY "vote"."circulationFrom" ASC, "vote"."circulationTo" ASC
LIMIT $3 OFFSET $4
`;

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    var countSql = '';
    var sql = '';
    var params = [];
    var _ = require('lodash');

    if (inputs.voteState === 0) {
      countSql = COUNT_SQL + NATIVE_NEW_WHERE;
      sql = SELECT_SQL + NATIVE_NEW_WHERE + OEDER_OPEN;
      params = [
        this.req.me.organization.id,
        dt.valueOf(),
        dt.valueOf(),
        this.req.me.id,
        this.req.me.id,
      ];
    } else if (inputs.voteState === 1) {
      countSql = COUNT_SQL + NATIVE_OPEN_WHERE;
      sql = SELECT_SQL + NATIVE_OPEN_WHERE + OEDER_OPEN;
      params = [
        this.req.me.organization.id,
        dt.valueOf(),
        dt.valueOf(),
        this.req.me.id,
        this.req.me.id,
      ];
    } else if (inputs.voteState === 2) {
      countSql = COUNT_SQL + NATIVE_CLOSED_WHERE;
      sql = SELECT_SQL + NATIVE_CLOSED_WHERE + OEDER_CLOSED;
      params = [this.req.me.organization.id, dt.valueOf(), this.req.me.id];
    } else {
      countSql = COUNT_SQL + NATIVE_MY_WHERE;
      sql = SELECT_SQL + NATIVE_MY_WHERE + OEDER_MY;
      params = [this.req.me.organization.id, this.req.me.id];
    }

    try {
      var rawResult = await sails.sendNativeQuery(countSql, params);
      response.records = rawResult.rows[0].qty;

      rawResult = await sails.sendNativeQuery(
        sql,
        _.concat(params, [pagination.limit, pagination.skip])
      );
      response.data = rawResult.rows;

      for (let entry of response.data) {
        entry.author = await User.findOne({ id: entry.author });
        await User.setGravatarUrl(entry.author, 36);

        var myAnswered = await VoteAnswer.count({ user: this.req.me.id, vote: entry.id });
        entry.answerState = {
          alive: entry.circulationFrom <= dt.valueOf() && entry.circulationTo >= dt.valueOf(),
          answered: myAnswered > 0,
          before: entry.circulationFrom > dt.valueOf(),
          after: entry.circulationTo < dt.valueOf(),
        };

        delete entry.body;
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
