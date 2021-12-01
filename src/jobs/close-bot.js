const moment = require('moment');
module.exports = {
  leaveAloneCheck: async function () {
    var bot = await sails.helpers.getBot();
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var threeMonthAgo = moment(dt.valueOf()).add(-3, 'months');

    const NATIVE_SQL = `
SELECT a.*
  FROM "thread" a
 WHERE a."id" IN (
  SELECT t."id" FROM (
    SELECT "thread" as "id", MAX("updatedAt") as "dt"
      FROM "thread_activity"
     WHERE "user" != $1
     GROUP BY "thread") t
   WHERE t.dt <= $2)
   AND a."status" = 0
   AND a."team" = $3
   AND a."local" = false
 ORDER BY a."lastHumanUpdateAt" ASC
`;

    try {
      for (let organization of await Organization.find()) {
        var teams = await Team.find({
          organization: organization.id,
          deleted: false,
          isSandbox: false,
        });
        for (let team of teams) {
          //
          var results = await sails.sendNativeQuery(NATIVE_SQL, [bot.id, threeMonthAgo.valueOf(), team.id]);

          for (let thread of results.rows) {
            await sails.getDatastore().transaction(async (db) => {
              let currentTags = await sails.models['tag_threads__thread_tags']
                // eslint-disable-next-line camelcase
                .find({ thread_tags: thread.id })
                .usingConnection(db);

              var valueSet = {
                status: 1,
                tags: currentTags.map((o) => {
                  return o.tag_threads;
                }),
                tagToken: ':',
              };

              let tags = await Tag.find()
                .where({ name: 'closed by bot', organization: organization.id })
                .usingConnection(db);

              if (tags.length < 1) {
                let tag = await Tag.create({ name: 'closed by bot', organization: organization.id })
                  .fetch()
                  .usingConnection(db);

                valueSet.tags.push(tag.id);
              } else {
                valueSet.tags.push(tags[0].id);
              }

              _.each(valueSet.tags, (tag) => {
                valueSet.tagToken += tag + ':';
              });

              await Thread.updateOne({ id: thread.id }).set(valueSet).usingConnection(db);

              var comment =
                // eslint-disable-next-line quotes
                "I closed this thread because it hasn't been updated for 3 months.\nPlease reopen this thread if necessary.\n";
              comment +=
                '３ヶ月間更新がないため、このスレッドをクローズしました。\n必要があれば再度このスレッドをオープンしてください。\n';

              var sneeze = {
                comment: comment,
                thread: thread.id,
                owner: bot.id,
              };

              var created = await Sneeze.create(sneeze).fetch().usingConnection(db);
              await sails.helpers.storage.createThreadActivity.with({
                db: db,
                type: 'create-sneeze',
                user: bot,
                thread: thread,
                sneezeId: created.id,
                botType: 'close-bot',
              });

              var sNo = await Sneeze.count({ thread: thread.id }).usingConnection(db);

              await sails.helpers.mail.sendThreadMailWrapper.with({
                thread: thread.id,
                action: 'sneeze',
                sneeze: created.id,
                hashTag: `#sneeze-${sNo}`,
                db: db,
              });
            });
          }
        }
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
