module.exports = {
  friendlyName: 'Update Reply',
  description: 'Update the Reply for the logged-in user.',
  inputs: {
    id: {
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
      description: 'Reply successfully updated.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Reply.findOne({
      id: inputs.id,
    })
      .populate('sneeze')
      .populate('thread');
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var emotional = await sails.helpers.emotionCheck.with({ contents: inputs.comment });
    var reply = {
      comment: inputs.comment,
      emotional: JSON.stringify(emotional),
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Reply.updateOne({
          id: current.id,
        })
          .set(reply)
          .usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'update-reply',
          user: this.req.me,
          thread: current.thread,
          sneezeId: current.sneeze.id,
          replyId: current.id,
          req: this.req,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated the reply');

    return {};
  },
};
