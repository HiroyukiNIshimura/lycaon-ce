const path = require('path');
const fs = require('fs');
const utility = require('./modules/job-utility');
const moment = require('moment');

module.exports = {
  clean: async function () {
    var threadQty = 0;
    var wikiQty = 0;
    var voteQty = 0;

    var hostid = process.env.HOSTING_URL;
    if (!hostid) {
      hostid = 'localhost';
    }

    //チームが削除され参照がNULLになっているスレッドの削除
    while (true) {
      var targetThreads = await Thread.find({ where: { team: null }, sort: 'id ASC', limit: 500 });
      if (targetThreads.length < 1) {
        break;
      }

      threadQty += targetThreads.length;

      for (let item of targetThreads) {
        try {
          let target = path.resolve(sails.config.appPath, 'appendix', hostid, 'thread', String(item.id));
          if (fs.existsSync(target)) {
            utility.rmdir(target);
            sails.log.debug(`添付ファイルを削除しました。${target}`);
          }
        } catch (err) {
          //無視
          sails.log.error(err);
        }
      }
    }

    //チームが削除され参照がNULLになっているWikiの削除
    while (true) {
      var targetWikis = await Wiki.find({
        where: { concept: 0, team: null },
        sort: 'id ASC',
        limit: 500,
      });
      if (targetWikis.length < 1) {
        break;
      }

      wikiQty += targetWikis.length;

      for (let item of targetWikis) {
        try {
          let target = path.resolve(sails.config.appPath, 'appendix', hostid, 'wiki', String(item.id));
          if (fs.existsSync(target)) {
            utility.rmdir(target);
            sails.log.debug(`添付ファイルを削除しました。${target}`);
          }
        } catch (err) {
          //無視
          sails.log.error(err);
        }
      }
    }

    //組織が削除され参照がNULLになっている回覧の削除
    while (true) {
      var targetVotes = await Vote.find({
        where: { organization: null },
        sort: 'id ASC',
        limit: 500,
      });
      if (targetVotes.length < 1) {
        break;
      }

      voteQty += targetVotes.length;

      for (let item of targetVotes) {
        try {
          let target = path.resolve(sails.config.appPath, 'appendix', hostid, 'vote', String(item.id));
          if (fs.existsSync(target)) {
            utility.rmdir(target);
            sails.log.debug(`添付ファイルを削除しました。${target}`);
          }
        } catch (err) {
          //無視
          sails.log.error(err);
        }
      }
    }

    //トランザクションは特に必要ないので制御しない
    try {
      await GitLog.destroy({ team: null });
      await Milestone.destroy({ team: null });
      await ThreadActivity.destroy({ team: null });

      await Thread.destroy({ team: null });
      await Wiki.destroy({ team: null });

      await Sneeze.destroy({ thread: null });
      await Reply.destroy({ thread: null });
      await ThreadItem.destroy({ thread: null });
      await WikiItem.destroy({ wiki: null });

      await Vote.destroy({ organization: null });
      await VoteItem.destroy({ vote: null });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    sails.log.info(`チーム参照のなくなったスレッド：${threadQty}件、Wiki：${wikiQty}件を削除しました。`);

    sails.log.info(`組織参照のなくなった回覧：${voteQty}件を削除しました。`);

    var dt = Date.now();
    moment.locale('ja');

    //期限ぎれメッセージの削除
    var targetAt = dt - sails.config.custom.messageDeleteAge;
    try {
      await Message.destroy({ createdAt: { '<': targetAt } });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
    sails.log.info(`${moment(targetAt).fromNow()}以前のメッセージを削除しました。`);

    //期限切れのシステム通知の削除
    targetAt = dt - sails.config.custom.sysNotificationDeleteAge;
    try {
      var list = await SysNotification.find({ postingAt: { '<': targetAt } });

      await sails.getDatastore().transaction(async (db) => {
        for (let notify of list) {
          await sails.models['sysnotification_users__user_sysnotifications']
            .destroy({
              // eslint-disable-next-line camelcase
              sysnotification_users: notify.id,
            })
            .usingConnection(db);
          await SysNotification.destroyOne({ id: notify.id }).usingConnection(db);
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    sails.log.info(`${moment(targetAt).fromNow()}以前のシステム通知を削除しました。`);
  },
};
