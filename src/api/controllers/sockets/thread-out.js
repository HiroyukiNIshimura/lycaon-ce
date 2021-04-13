module.exports = {
  friendlyName: 'thread out',
  description: 'thread out.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (!this.req.isSocket) {
      return 'notFound';
    }
    if (!this.req.organization) {
      return 'notFound';
    }

    var thread = await Thread.findOne({
      id: inputs.id,
    });
    if (!thread) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }
    if (team.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var message = {};

    if (
      !this.req.session.threadNotifyExpiresAt ||
      this.req.session.threadNotifyExpiresAt <= Date.now()
    ) {
      this.req.session.threadNotifyExpiresAt =
        Date.now() + sails.config.custom.socketMessageResetTokenTTL;

      message = {
        key: '{0} [{1}] has left this thread',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };
    }

    var room = `room-${this.req.organization.id}-thread-${thread.id}`;
    sails.sockets.broadcast(room, 'thread-out', {
      message: message,
      user: this.req.me,
    });
    sails.sockets.leave(this.req, room);

    return {};
  },
};
