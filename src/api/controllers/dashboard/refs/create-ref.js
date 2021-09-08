module.exports = {
  friendlyName: 'Add child',
  description: 'Add the thread for the child.',
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
    childIsParent: {
      statusCode: 405,
      description: 'The child is parent.',
    },
    childIsThis: {
      statusCode: 405,
      description: 'The child is this thread.',
    },
    childAlreadyInUse: {
      statusCode: 409,
      description: 'The provided child is already in use.',
    },
  },

  fn: async function (inputs) {
    if (inputs.thread === inputs.child) {
      throw 'childIsThis';
    }

    var current = await Thread.findOne({
      id: inputs.thread,
    });
    if (!current) {
      throw 'notFound';
    }
    if (current.parent === inputs.child) {
      throw 'childIsParent';
    }

    var child = await Thread.findOne({
      id: inputs.child,
    });
    if (!child) {
      throw 'notFound';
    }
    if (child.team !== current.team) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var ref = await ThreadRef.findOne({ left: inputs.thread, right: inputs.child });
    if (ref) {
      throw 'childAlreadyInUse';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await ThreadRef.create({ left: current.id, right: child.id }).usingConnection(db);
        await ThreadRef.create({ left: child.id, right: current.id }).usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'relationship',
          user: this.req.me,
          thread: current,
          refId: child.id,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('A thread [#{0}] has been associated').format(inputs.child);

    return {};
  },
};
