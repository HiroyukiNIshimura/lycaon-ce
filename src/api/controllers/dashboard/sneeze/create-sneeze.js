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
        return Buffer.byteLength(value, 'utf8') < 107374180;
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
        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'create-sneeze',
          user: this.req.me,
          thread: thread,
          sneezeId: created.id,
        });

        var sNo = await Sneeze.count({ thread: thread.id }).usingConnection(db);

        await sails.helpers.sendThreadMailWrapper.with({
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

    var rooms = [`room-${this.req.organization.id}-thread-${thread.id}`];
    var message = {
      key: 'a comment has arrived from {0}',
      params: [this.req.me.fullName],
    };
    sails.sockets.broadcast(rooms, 'comment-notify', {
      message: message,
      user: this.req.me,
      comment: await sails.helpers.sanitizeDescription.with({ markdown: inputs.comment, max: 120 }),
      timespan: Date.now(),
      id: thread.id,
    });

    this.req.session.effectMessage = sails.__('Created a comment');

    return {};
  },
};
