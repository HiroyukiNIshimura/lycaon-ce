module.exports = {
  friendlyName: 'Update thread responsible',
  description: 'Update the thread responsible.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    responsible: {
      type: 'number',
    },
  },
  exits: {
    success: {
      description: "Thread's responsible successfully updated.",
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Thread.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    if (current.responsible === inputs.responsible) {
      return;
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    if (inputs.responsible) {
      var user = await User.findOne({ id: inputs.responsible });
      if (!user) {
        throw 'notFound';
      }
    }

    var valueSet = { responsible: null, lastUpdateUser: this.req.me.id };
    if (inputs.responsible) {
      valueSet = { responsible: inputs.responsible, lastUpdateUser: this.req.me.id };
    }

    var updated = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        updated = await Thread.updateOne({
          id: current.id,
        })
          .set(valueSet)
          .usingConnection(db);

        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'responsible',
          user: this.req.me,
          thread: updated,
        });

        await sails.helpers.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'responsible',
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var rooms = [
      `room-${this.req.organization.id}-lycaon`,
      `room-${this.req.organization.id}-team-${team.id}`,
      `room-${this.req.organization.id}-thread-${updated.id}`,
    ];

    var message = {
      key: '{0} has changed the person responsible for thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };
    //
    sails.sockets.broadcast(rooms, 'thread-notify', {
      message: message,
      user: this.req.me,
      thread: updated,
      timespan: Date.now(),
    });

    this.req.session.effectMessage = sails.__('Updated the person in charge');

    return {};
  },
};
