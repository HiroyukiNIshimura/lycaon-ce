module.exports = {
  friendlyName: 'Add parent',
  description: 'Add the thread for the parent.',
  inputs: {
    thread: {
      type: 'number',
      required: true,
    },
    parent: {
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
    parentIsThis: {
      statusCode: 405,
      description: 'The parent is this thread.',
    },
    parentAlreadyInUse: {
      statusCode: 409,
      description: 'The provided parent is already in use.',
    },
  },

  fn: async function (inputs) {
    if (inputs.thread === inputs.parent) {
      throw 'parentIsThis';
    }

    var current = await Thread.findOne({
      id: inputs.thread,
    });
    if (!current) {
      throw 'notFound';
    }

    if (current.parent) {
      throw 'parentAlreadyInUse';
    }

    var parent = await Thread.findOne({
      id: inputs.parent,
    });
    if (!parent) {
      throw 'notFound';
    }

    if (current.team !== parent.team) {
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
          .set({ parent: parent.id })
          .usingConnection(db);
        var ref = await ThreadRef.findOne({ left: parent.id, right: current.id }).usingConnection(db);
        if (!ref) {
          await ThreadRef.create({ left: parent.id, right: current.id }).usingConnection(db);
        }

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'relationship',
          user: this.req.me,
          thread: current,
          refId: parent.id,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('A new fork source thread has been associated');

    return {};
  },
};
