module.exports = {
  friendlyName: 'Update thread concept',
  description: 'Update the thread concept.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    concept: {
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

    if (current.concept === inputs.concept) {
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
      concept: inputs.concept,
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

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'update-concept',
          user: this.req.me,
          thread: updated,
          req: this.req,
        });

        await sails.helpers.mail.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'concept',
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var message = {
      key: '{0} changed the thread [#{1}] {2} to draft',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    if (updated.concept === 1) {
      message = {
        key: '{0} has published the thread [#{1}] {2}',
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

    //
    this.req.session.effectMessage = sails.__('Updated the concept');

    return {};
  },
};
