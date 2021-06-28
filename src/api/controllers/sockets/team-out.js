module.exports = {
  friendlyName: 'team out',
  description: 'team out.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a team that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (!this.req.isSocket) {
      return 'notFound';
    }
    if (!this.req.me) {
      return 'notFound';
    }
    if (!this.req.organization) {
      return 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }
    if (team.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var message = {};

    if (!this.req.session.teamNotifyExpiresAt || this.req.session.teamNotifyExpiresAt <= Date.now()) {
      this.req.session.teamNotifyExpiresAt = Date.now() + sails.config.custom.socketMessageResetTokenTTL;

      message = {
        key: '{0} [{1}] has left this team',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };
    }

    var room = `room-${this.req.organization.id}-team-${team.id}`;
    sails.sockets.broadcast(room, 'team-out', {
      message: message,
      user: this.req.me,
    });
    sails.sockets.leave(this.req, room);

    return {};
  },
};
