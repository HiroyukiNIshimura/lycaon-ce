module.exports = {
  friendlyName: 'Update thread lock',
  description: 'Update the thread lock.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    locked: {
      type: 'boolean',
      required: true,
    },
  },
  exits: {
    success: {
      description: "Thread's status successfully updated.",
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

    if (current.locked === inputs.locked) {
      return;
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var valueSet = { locked: inputs.locked, lastUpdateUser: this.req.me.id };
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
          type: 'update-lock',
          user: this.req.me,
          thread: updated,
        });

        await sails.helpers.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'archive',
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
      key: '{0} has unarchived the thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    if (updated.locked) {
      message = {
        key: '{0} has archived the thread [#{1}] {2}',
        params: [this.req.me.fullName, updated.no, updated.subject],
      };
    }

    sails.sockets.broadcast(rooms, 'thread-notify', {
      message: message,
      user: this.req.me,
      thread: updated,
      timespan: Date.now(),
    });
    //
    this.req.session.effectMessage = sails.__('The archive has been updated');

    return {};
  },
};
