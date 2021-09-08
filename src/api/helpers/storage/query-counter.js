module.exports = {
  friendlyName: 'storage.queryCounter',
  description: 'query counters.',
  inputs: {
    team: {
      type: 'ref',
      required: true,
      description: 'team.id | Array team.id',
    },
    user: {
      type: 'ref',
      required: true,
      description: 'user instance',
    },
    flags: {
      type: 'ref',
      description: 'Array flags.id',
    },
    db: {
      type: 'ref',
      description: 'db instance',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var counter = {};
    var query = {};

    var flags = inputs.flags;
    if (!flags) {
      var user = await User.findOne({
        id: inputs.user.id,
      }).populate('flags');

      flags = user.flags.map((o) => {
        return o.id;
      });
    }

    try {
      if (_.isArray(inputs.team)) {
        query.queryMyThread = Thread.count().where({
          team: {
            in: inputs.team,
          },
          responsible: inputs.user.id,
          status: 0,
        });

        query.queryWorking = Thread.count().where({
          team: {
            in: inputs.team,
          },
          working: true,
          status: 0,
        });

        query.queryFlag = Thread.count().where({
          team: {
            in: inputs.team,
          },
          id: {
            in: flags,
          },
          status: 0,
        });

        query.queryLocal = Thread.count().where({
          team: {
            in: inputs.team,
          },
          local: true,
          owner: inputs.user.id,
          status: 0,
        });
      } else {
        query.queryMyThread = Thread.count().where({
          team: inputs.team,
          responsible: inputs.user.id,
          status: 0,
        });

        query.queryWorking = Thread.count().where({
          team: inputs.team,
          working: true,
          status: 0,
        });

        query.queryFlag = Thread.count().where({
          team: inputs.team,
          id: {
            in: flags,
          },
          status: 0,
        });

        query.queryLocal = Thread.count().where({
          team: inputs.team,
          local: true,
          owner: inputs.user.id,
          status: 0,
        });
      }

      var NATIVE_NEW_VOTE_SQL = `
SELECT COUNT("vote".*) as "qty"
  FROM "vote"
 WHERE "vote"."organization" = $1
   AND "vote"."circulationFrom" <= $2
   AND "vote"."circulationTo" >= $3
   AND "vote"."id" IN (SELECT "vote_users" FROM "user_votes__vote_users" WHERE "user_votes" = $4)
   AND "vote"."id"
       NOT IN (SELECT "vote_choices"."vote" FROM "vote_choices" WHERE "vote_choices"."id"
           IN (SELECT "vote_answer"."voteChoices" FROM "vote_answer" WHERE "vote_answer"."user" = $5))
`;

      var dt = new Date();
      dt.setHours(0, 0, 0, 0);

      var params = [inputs.user.organization.id, dt.valueOf(), dt.valueOf(), inputs.user.id, inputs.user.id];

      if (inputs.db) {
        counter.myThread = await query.queryMyThread.usingConnection(inputs.db);
        counter.working = await query.queryWorking.usingConnection(inputs.db);
        counter.flag = await query.queryFlag.usingConnection(inputs.db);
        counter.local = await query.queryLocal.usingConnection(inputs.db);

        let rawResult = await sails.sendNativeQuery(NATIVE_NEW_VOTE_SQL, params).usingConnection(inputs.db);
        counter.votes = rawResult.rows[0].qty;
      } else {
        counter.myThread = await query.queryMyThread;
        counter.working = await query.queryWorking;
        counter.flag = await query.queryFlag;
        counter.local = await query.queryLocal;

        let rawResult = await sails.sendNativeQuery(NATIVE_NEW_VOTE_SQL, params);
        counter.votes = rawResult.rows[0].qty;
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
    return counter;
  },
};
