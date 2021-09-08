const _ = require('@sailshq/lodash');
const { JpKw } = require('./modules/crocro.webAi.JpKw');

module.exports = {
  tagifyCheck: async function ({ id, team, organization }) {
    var bot = await sails.helpers.getBot();
    var index = _.findIndex(bot.teams, (o) => {
      return o.id === team;
    });
    if (index < 0) {
      sails.log.debug(`このチーム[${team}]には、lycaonbotがいないのでタグ候補サーチは実行しません。`);
      return 'skip';
    }

    var thread = await Thread.findOne({ id: id }).populate('tags');
    if (!thread) {
      sails.log.error(`スレッドが見つかりませんでした。スレッド[${id}]`);
      return 'skip';
    }

    var already = await ThreadActivity.count({
      thread: thread.id,
      user: bot.id,
      type: 'create-sneeze',
      stateWord: 'tagify-bot',
    });
    if (already > 0) {
      sails.log.debug(`このスレッドでは提案済み。スレッド[${id}]`);
      return;
    }

    //1/3の確率のくじ引き
    var rnd = Math.floor(Math.random() * 100);
    if (rnd > 33) {
      sails.log.debug(`タグ候補サーチの抽選に外れました。スレッド[${id}]`);
      return;
    }

    var sentens =
      thread.subject + ' ' + (await sails.helpers.sanitizeDescription.with({ markdown: thread.body, max: 1000 }));

    var keywordSearcher = new JpKw();
    keywordSearcher.addSrc(sentens);

    var regx = new RegExp(/(.)\1{3,}/, 'ig');

    var results = _.filter(keywordSearcher.getKwArr(), (o) => {
      if (o[0] < 3) {
        return false;
      }

      if (o[2] < 0) {
        return false;
      }

      var index = _.findIndex(thread.tags, (tag) => {
        return tag.name === String(o[1]).toLowerCase();
      });
      if (index > -1) {
        return false;
      }

      if (o[1].match(regx)) {
        return false;
      }

      return true;
    });

    if (results.length < 1) {
      sails.log.debug(`キーワードは見つかりませんでした。スレッド[${id}]`);
      return;
    }

    //
    sails.log.debug(`キーワード確定！スレッド[${id}] ${results}`);

    // eslint-disable-next-line quotes
    var comment = "Wouldn't it be nice to tag this thread as follows?\n";
    comment += 'このスレッドに、以下のタグをつけるのはいかがでしょうか？\n';
    comment += 'We hope for your reference.\n';
    comment += 'ご参考になれば幸いです😃\n';

    for (let entry of results) {
      comment += `- ${entry[1]}\n`;
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
          botType: 'tagify-bot',
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
