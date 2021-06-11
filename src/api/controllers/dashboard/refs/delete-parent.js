module.exports = {
  friendlyName: 'delete parent',
  description: 'delete the thread for the parent.',
  inputs: {
    thread: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Thread successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Thread.findOne({
      id: inputs.thread,
    });
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Thread.updateOne({
          id: current.id,
        })
          .set({ parent: null })
          .usingConnection(db);

        await ThreadRef.destroy({ left: current.parent, right: current.id }).usingConnection(db);

        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'delete-relationship',
          user: this.req.me,
          thread: current,
          refId: current.parent,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Removed the fork source thread association');

    return {};
  },
};
