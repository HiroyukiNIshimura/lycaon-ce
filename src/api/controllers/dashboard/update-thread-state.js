module.exports = {
  friendlyName: 'Update thread state',
  description: 'Update the thread state.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    status: {
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

    if (current.status === inputs.status) {
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
      status: inputs.status,
      lastUpdateUser: this.req.me.id,
      lastHumanUpdateAt: Date.now(),
    };
    if (inputs.status === 1) {
      valueSet.working = false;
      valueSet.workingUser = null;
    }
    var updated = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        updated = await Thread.updateOne({
          id: current.id,
        })
          .set(valueSet)
          .usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'update-status',
          user: this.req.me,
          thread: updated,
          req: this.req,
        });

        if (inputs.status === 1) {
          await sails.helpers.timeMeasurement.with({ db: db, thread: updated });
        }

        await sails.helpers.mail.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'status',
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var message = {
      key: '{0} has opened the thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    if (updated.status === 1) {
      message = {
        key: '{0} has closed the thread [#{1}] {2}',
        params: [this.req.me.fullName, updated.no, updated.subject],
      };
    }

    if (!updated.local) {
      var rooms = [
        `room-${this.req.organization.id}-lycaon`,
        `room-${this.req.organization.id}-team-${team.id}`,
        `room-${this.req.organization.id}-thread-${updated.id}`,
      ];

      sails.sockets.broadcast(rooms, 'thread-notify', {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      });
    }

    this.req.session.effectMessage = sails.__('The status has been updated');

    return {};
  },
};
