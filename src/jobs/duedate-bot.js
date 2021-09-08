const moment = require('moment');
module.exports = {
  duedateCheck: async function () {
    var bot = await sails.helpers.getBot();
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var range = moment(dt.valueOf()).add(-5, 'days');

    for (let team of await Team.find({ deleted: false })) {
      var index = _.findIndex(bot.teams, (o) => {
        return o.id === team.id;
      });
      if (index < 0) {
        sails.log.debug(`このチーム[${team.id}]には、lycaonbotがいないので期限切れ通知は実行しません。`);
        continue;
      }

      var threads = await Thread.find({
        where: { status: 0, urgency: 6, dueDateAt: { '>=': range.valueOf(), '<': dt.valueOf() }, team: team.id },
      }).populate('activities', {
        where: {
          type: 'create-sneeze',
          stateWord: 'duedate-bot',
        },
      });
      if (threads.length < 1) {
        sails.log.debug(`期限切れスレッドは見つかりませんでした。チーム[${team.id}]`);
        return;
      }
      //
      for (let thread of threads) {
        if (thread.activities.length > 0) {
          sails.log.debug(`このスレッドは処理済みです。スレッド[${thread.id}]`);
          continue;
        }

        var comment = 'The thread has expired. Why not consider closing the thread or changing the deadline?\n';
        comment +=
          'スレッドの期限が切れています。スレッドをクローズするか期限を変更するかを検討してはいかがでしょうか？\n';

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
              botType: 'duedate-bot',
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
          throw err;
        }
      }
    }
  },
};
