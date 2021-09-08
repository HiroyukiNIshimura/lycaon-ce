module.exports = {
  similarityCheck: async function ({ id, team, subject, body, organization }) {
    var NATIVE_SQL = `
SELECT (SELECT bigm_similarity($1, t."subject")) as "subjectScore",
  (SELECT bigm_similarity($2, t."body")) as "bodyScore",
  t.*
  FROM "thread" t
 WHERE t."id" != $3
   AND t."team" = $4
   AND (t."subject" =% $5 OR t."body" =% $6)
 ORDER BY "bodyScore" DESC, "subjectScore" DESC
 LIMIT 5;
`;

    var bot = await sails.helpers.getBot();
    var index = _.findIndex(bot.teams, (o) => {
      return o.id === team;
    });
    if (index < 0) {
      sails.log.debug(`このチーム[${team}]には、lycaonbotがいないので類似スレッド検索は実行しません。`);
      return 'skip';
    }

    var thread = await Thread.findOne({ id: id });
    if (!thread) {
      sails.log.error(`スレッドが見つかりませんでした。スレッド[${id}]`);
      return 'skip';
    }

    var results = await sails.sendNativeQuery(NATIVE_SQL, [subject, body, id, team, subject, body]);
    var targes = _.filter(results.rows, (o) => {
      if (o.subjectScore > sails.config.custom.similarity.subjectLimt) {
        return true;
      }
      if (o.bodyScore > sails.config.custom.similarity.bodyLimit) {
        return true;
      }
      return false;
    });
    if (targes.length < 1) {
      sails.log.debug(`類似スレッドは見つかりませんでした。スレッド[${id}]`);
      return;
    }

    sails.log.debug(`類似スレッドヒット ${targes.length}件！スレッド[${id}]`);

    var comment = 'A similar thread has been created a long time ago! It may be helpful. please make sure.\n';
    comment += '昔似たようなスレッドが作成されていますよ！参考になるかもしれません。確認してみてください。\n';
    comment += 'Excuse me if I am wrong.\n';
    comment += '間違ってたらごめんなさい😅\n';

    for (let entry of targes) {
      comment += ` #${entry.id} ${entry.subject} (score: ${entry.subjectScore.toFixed(3)}/${entry.bodyScore.toFixed(
        3
      )})\n`;
    }

    var sneeze = {
      comment: comment,
      thread: thread.id,
      owner: bot.id,
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        var created = await Sneeze.create(sneeze).fetch().usingConnection(db);
        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'create-sneeze',
          user: bot,
          thread: thread,
          sneezeId: created.id,
          botType: 'similarity-bot',
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
    } catch (err) {
      sails.log.error(err);
    }

    await sails.helpers.broadcastCommentNotify.with({
      organizationId: organization.id,
      threadId: thread.id,
      fromUser: bot,
      comment: comment,
    });
  },
};
