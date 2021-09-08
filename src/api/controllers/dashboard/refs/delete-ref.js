module.exports = {
  friendlyName: 'delete child',
  description: 'delete the thread for the child.',
  inputs: {
    thread: {
      type: 'number',
      required: true,
    },
    child: {
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

    var child = await Thread.findOne({
      id: inputs.child,
    });

    try {
      await sails.getDatastore().transaction(async (db) => {
        await ThreadRef.destroy({ left: current.id, right: inputs.child }).usingConnection(db);
        await ThreadRef.destroy({ left: inputs.child, right: current.id }).usingConnection(db);
        if (child && child.parent === current.id) {
          await Thread.updateOne({ id: child.id }).set({ parent: null });
        }

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'delete-relationship',
          user: this.req.me,
          thread: current,
          refId: inputs.child,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Removed association with thread [#{0}]').format(inputs.child);

    return {};
  },
};
