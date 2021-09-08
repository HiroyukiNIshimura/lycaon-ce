module.exports = {
  friendlyName: 'Delete Sneeze',
  description: 'Delete the Sneeze for the logged-in user.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Sneeze successfully deleted.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Sneeze.findOne({
      id: inputs.id,
    }).populate('thread');
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
          type: 'delete-sneeze',
          user: this.req.me,
          thread: current.thread,
          sneezeId: current.id,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Deleted the comment');

    return {};
  },
};
