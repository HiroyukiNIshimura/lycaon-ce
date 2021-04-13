module.exports = {
  friendlyName: 'Query threads for select2',
  description: 'Query threads for select2.',
  inputs: {
    team: {
      type: 'number',
      description: 'team.id',
      required: true,
    },
    thread: {
      type: 'number',
      description: 'thread.id',
      required: true,
    },
    search: {
      type: 'string',
      description: 'select2 input term',
    },
    page: {
      type: 'number',
      description: 'page',
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
    var response = {
      results: [],
      pagination: { more: false },
    };

    if (!inputs.search) {
      return response;
    }

    var team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });

    var NATIVE_COUNT_SQL = `
SELECT COUNT(t.*) FROM "thread" t 
 WHERE t."team" = $1
   AND TO_CHAR(t."no", 'FM99999999') like $2
`;

    var NATIVE_SQL = `
SELECT t.* FROM "thread" t 
 WHERE t."team" = $1
   AND TO_CHAR(t."no", 'FM99999999') like $2
 ORDER BY t."id" ASC
 LIMIT $3 OFFSET $4
`;
    try {
      var countResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL, [
        team.id,
        `${inputs.search}%`,
      ]);

      var rawResult = await sails.sendNativeQuery(NATIVE_SQL, [
        team.id,
        `${inputs.search}%`,
        pagination.limit,
        pagination.skip,
      ]);

      var pageCount = Math.ceil(countResult.rows[0] / pagination.limit);
      if (inputs.page < pageCount) {
        response.pagination.more = true;
      }

      for (let entry of rawResult.rows) {
        response.results.push({
          id: entry.id,
          text: `[#${entry.no}]${entry.subject}`,
          entity: entry,
          disabled: entry.id === inputs.thread,
        });
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
