module.exports = {
  friendlyName: 'Update thread duedate',
  description: 'Update the thread duedate.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    priority: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: `Thread's status successfully updated.`,
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

    if (current.priority === inputs.priority) {
      return;
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var valueSet = {
      priority: inputs.priority,
      lastUpdateUser: this.req.me.id,
      lastHumanUpdateAt: Date.now(),
    };
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
          type: 'update-priority',
          user: this.req.me,
          thread: updated,
        });

        await sails.helpers.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'priority',
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

    var priority = 'Normally';
    switch (updated.priority) {
      case 0:
        priority = 'Low';
        break;
      case 2:
        priority = 'High';
        break;
      case 1:
      default:
        break;
    }
    var message = {
      key: '{0} changed the importance of thread [#{1}] {2} to [{3}]',
      params: [this.req.me.fullName, updated.no, updated.subject, sails.__(priority)],
    };

    //
    if (!updated.local) {
      sails.sockets.broadcast(rooms, 'thread-notify', {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      });
    }

    //

    this.req.session.effectMessage = sails.__('Updated importance');

    return {};
  },
};
