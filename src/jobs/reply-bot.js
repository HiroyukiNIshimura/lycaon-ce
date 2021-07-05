const _ = require('@sailshq/lodash');
const { JpMrkv } = require('./modules/crocro.webAi.JpMrkv');

module.exports = {
  reply: async function ({ reply, sneeze, team, organization }) {
    var bot = await sails.helpers.getBot();
    if (sneeze.owner !== bot.id) {
      return;
    }

    var index = _.findIndex(bot.teams, (o) => {
      return o.id === team.id;
    });
    if (index < 0) {
      sails.log.debug(`このチーム[${team.id}]には、lycaonbotがいないのでリプライは実行しません。`);
      return;
    }

    var already = await Reply.count({ sneeze: sneeze.id, owner: bot.id });
    if (already > 0) {
      sails.log.debug(`このコメントへはリプライ済み。コメント[${sneeze.id}]`);
      return;
    }

    //1/3の確率のくじ引き
    var rnd = Math.floor(Math.random() * 100);
    if (rnd > 33) {
      sails.log.debug(`リプライ実行の抽選に外れました。コメント[${sneeze.id}]、対象リプライ[${reply.id}]`);
      return;
    }

    sails.log.debug(`リプライを実行します。コメント[${sneeze.id}]、対象リプライ[${reply.id}]`);

    var emo = this.topEmotional(reply.emotional);
    var target = await User.findOne({ id: reply.owner });
    var comment = `${target.fullName} !\n`;

    rnd = Math.floor(Math.random() * 100);
    if (target.languagePreference === 'ja' && rnd > 20) {
      //マルコフ生成
      var sentens = [
        sneeze.thread.subject,
        await sails.helpers.sanitizeDescription.with({ markdown: sneeze.thread.body, max: 500 }),
      ];

      for (let entity of await Reply.find({ where: { sneeze: sneeze.id }, limit: 10 })) {
        sentens.push(await sails.helpers.sanitizeDescription.with({ markdown: entity.comment, max: 500 }));
      }

      for (let entity of await Sneeze.find({ where: { thread: sneeze.thread.id }, limit: 10 })) {
        sentens.push(await sails.helpers.sanitizeDescription.with({ markdown: entity.comment, max: 500 }));
      }

      var mrkv = new JpMrkv();
      mrkv.setSntncArr(sentens);
      var result = mrkv.getSntnc({ strtStr: '' });
      if (result) {
        comment += `${result}\n`;
      } else {
        comment += `${this.parseComment(reply, emo)}\n`;
        comment += `${this.parseJaComment(reply, emo)}\n`;
      }
    } else {
      comment += `${this.parseComment(reply, emo)}\n`;
      comment += `${this.parseJaComment(reply, emo)}\n`;
    }

    var emotional = await sails.helpers.emotionCheck.with({ contents: comment });
    var valuesToSet = {
      comment: comment,
      thread: sneeze.thread.id,
      sneeze: sneeze.id,
      owner: bot.id,
      emotional: JSON.stringify(emotional),
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        var created = await Reply.create(valuesToSet).fetch().usingConnection(db);

        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'create-reply',
          user: bot,
          thread: sneeze.thread,
          sneezeId: sneeze.id,
          replyId: created.id,
          botType: 'reply-bot',
        });
        //ハッシュタグはコメントを狙う
        var sneezes = await Sneeze.find({ thread: reply.thread }).usingConnection(db);
        var sNo = _.findIndex(sneezes, { id: reply.sneeze });
        sNo++;

        await sails.helpers.sendThreadMailWrapper.with({
          thread: sneeze.thread.id,
          action: 'reply',
          reply: created.id,
          hashTag: `#sneeze-${sNo}`,
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    await sails.helpers.broadcastCommentNotify.with({
      organizationId: organization.id,
      threadId: sneeze.thread.id,
      fromUser: bot,
      comment: comment,
    });
  },
  parseComment: function (reply, emo) {
    var comment = '';

    switch (emo) {
      case 'anger':
        comment += 'Not my monkey, not my circus.\n';
        break;
      case 'fear':
        comment += 'You’ll never find a rainbow if you’re looking down.\n';
        break;
      case 'happy':
        comment += 'If you can dream it, you can do it. \n';
        break;
      case 'hatred':
        // eslint-disable-next-line quotes
        comment += "All you need is love. But a little chocolate now and then doesn't hurt.\n";
        break;
      case 'sad':
        comment += 'A good hearty laugh would help more than ten Valerian pills.\n';
        break;
      case 'shame':
        comment += 'A friend is someone who loves you in spite of your faults.\n';
        break;
      case 'surprise':
        comment +=
          'I could do anything, but instead I’ll do nothing. Isn’t it marvellous to do just what one feels like?\n';
        break;
      default:
        break;
    }
    return comment;
  },
  parseJaComment: function (reply, emo) {
    var comment = '';

    switch (emo) {
      case 'anger':
        comment += 'たいせつなのは、じぶんのしたいことをじぶんで知ってるってことですよ。\n';
        break;
      case 'fear':
        comment += '下を向いていたら、虹を見つけられませんよ。\n';
        break;
      case 'happy':
        comment += '夢を見ることができるなら、それは実現できるんですよ！\n';
        break;
      case 'hatred':
        comment += '必要なのは愛だけ。でも、時々ちょっとチョコレートがあっても、かまわないけど。\n';
        break;
      case 'sad':
        comment += '薬を10錠飲むよりも、心から笑った方がずっと効果があるはずです。\n';
        break;
      case 'shame':
        comment += '友達とは...あなたの欠点を愛してくれる人のこと。\n';
        break;
      case 'surprise':
        comment += '何でも出来るけど、あえて何もしません。やりたいことだけやるって素敵でしょ？\n';
        break;
      default:
        break;
    }
    return comment;
  },
  topEmotional: function (emotional) {
    var emo = JSON.parse(emotional);
    var results = [];
    for (let key of _.keys(emo)) {
      results.push({
        type: key,
        turn: Number(emo[key].turn),
        score: Number(emo[key].score),
      });
    }

    results.sort((a, b) => {
      return b.turn + b.score - (a.turn + a.score);
    });
    return results[0].type;
  },
};
