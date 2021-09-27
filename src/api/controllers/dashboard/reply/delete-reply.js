module.exports = {
  friendlyName: 'Delete Reply',
  description: 'Delete the Reply for the logged-in user.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Reply successfully deleted.',
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

    var sneeze = {
      deleted: true,
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Sneeze.updateOne({
          id: current.id,
        })
          .set(sneeze)
          .usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'delete-reply',
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

    this.req.session.effectMessage = sails.__('Deleted the reply');

    return {};
  },
};
