module.exports = {
  friendlyName: 'Update thread working',
  description: 'Update the thread working.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    working: {
      type: 'boolean',
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
    alreadyInWorking: {
      statusCode: 409,
      description: 'The provided thread is already in working.',
    },
  },

  fn: async function (inputs) {
    var current = await Thread.findOne({
      id: inputs.id,
    }).populate('workingUser');
    if (!current) {
      throw 'notFound';
    }

    if (current.working && inputs.working) {
      throw { alreadyInWorking: { message: current.workingUser.fullName } };
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var valueSet = {
      working: inputs.working,
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

        if (inputs.working) {
          if (updated.working && updated.workingUser) {
            throw { alreadyInWorking: { message: updated.workingUser.fullName } };
          }

          updated = await Thread.updateOne({
            id: current.id,
          })
            .set({ workingUser: this.req.me.id })
            .usingConnection(db);
        } else {
          updated = await Thread.updateOne({
            id: current.id,
          })
            .set({ workingUser: null })
            .usingConnection(db);
        }

        await sails.helpers.createThreadActivity.with({
          db: db,
          type: 'update-working',
          user: this.req.me,
          thread: updated,
        });

        if (!inputs.working) {
          await sails.helpers.timeMeasurement.with({ db: db, thread: updated });
        }

        await sails.helpers.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'working',
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
      key: '{0} has finished working on thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    if (updated.working) {
      message = {
        key: '{0} has started working on the thread [#{1}] {2}',
        params: [this.req.me.fullName, updated.no, updated.subject],
      };
    }
    //
    if (!updated.local) {
      sails.sockets.broadcast(rooms, 'thread-notify', {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      });
    }

    this.req.session.effectMessage = sails.__('The working status has been updated');

    return {};
  },
};
