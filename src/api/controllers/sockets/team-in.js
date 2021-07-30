module.exports = {
  friendlyName: 'team in',
  description: 'team in.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    navigation: {
      type: 'string',
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a team that has not joined.',
    },
  },

  fn: async function (inputs) {
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

    if (inputs.navigation !== 'reload') {
      message = {
        key: '{0} [{1}] has joined this team',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };
    }

    var room = `room-${this.req.organization.id}-team-${team.id}`;
    sails.sockets.join(this.req, room);
    sails.sockets.broadcast(room, 'team-in', {
      message: message,
      user: this.req.me,
    });

    return {};
  },
};
