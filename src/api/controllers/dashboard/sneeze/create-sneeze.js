module.exports = {
  friendlyName: 'Create Sneeze',
  description: 'Create the Sneeze for the logged-in user.',
  inputs: {
    thread: {
      type: 'number',
      required: true,
    },
    comment: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Sneeze successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var thread = await Thread.findOne({
      id: inputs.thread,
    });
    if (!thread) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var emotional = await sails.helpers.emotionCheck.with({ contents: inputs.comment });
    var sneeze = {
      comment: inputs.comment,
      thread: thread.id,
      owner: this.req.me.id,
      emotional: JSON.stringify(emotional),
    };

    var created;

    try {
      await sails.getDatastore().transaction(async (db) => {
        created = await Sneeze.create(sneeze).fetch().usingConnection(db);
        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'create-sneeze',
          user: this.req.me,
          thread: thread,
          sneezeId: created.id,
          req: this.req,
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

    await sails.helpers.broadcastCommentNotify.with({
      organizationId: this.req.organization.id,
      threadId: thread.id,
      fromUser: this.req.me,
      comment: inputs.comment,
    });

    this.req.session.effectMessage = sails.__('Created a comment');

    return {};
  },
};
