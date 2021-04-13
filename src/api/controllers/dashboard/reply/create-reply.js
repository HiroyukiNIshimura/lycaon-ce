const Agenda = require('agenda');
module.exports = {
  friendlyName: 'Create Reply',
  description: 'Create the Reply for the logged-in user.',
  inputs: {
    sneeze: {
      type: 'number',
      required: true,
    },
    comment: {
      type: 'string',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Reply successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var agenda = new Agenda({
      db: {
        address: sails.config.custom.agenda.mongoUrl,
        collection: sails.config.custom.agenda.collection,
        options: sails.config.custom.agenda.options,
      },
    });

    var sneeze = await Sneeze.findOne({
      id: inputs.sneeze,
    }).populate('thread');
    if (!sneeze) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: sneeze.thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var emotional = await sails.helpers.emotionCheck.with({ contents: inputs.comment });
    var valuesToSet = {
      comment: inputs.comment,
      thread: sneeze.thread.id,
      sneeze: sneeze.id,
      owner: this.req.me.id,
      emotional: JSON.stringify(emotional),
    };

    var created = {};
    try {
      await sails.getDatastore().transaction(async (db) => {
        created = await Reply.create(valuesToSet).fetch().usingConnection(db);

        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'create-reply',
          user: this.req.me,
          thread: sneeze.thread,
          sneezeId: sneeze.id,
          replyId: created.id,
        });
        //ハッシュタグはコメントを狙う
        var sneezes = await Sneeze.find({ thread: created.thread.id }).usingConnection(db);
        var sNo = _.findIndex(sneezes, { id: created.sneeze });
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

    this.req.session.effectMessage = sails.__('Created a reply');

    return {};
  },
};
