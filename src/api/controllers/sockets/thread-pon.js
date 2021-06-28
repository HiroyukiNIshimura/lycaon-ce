module.exports = {
  friendlyName: 'thread pon',
  description: 'thread pon.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    user: {
      type: 'ref',
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

    var room = `room-${this.req.organization.id}-thread-${inputs.id}`;
    sails.sockets.broadcast(room, 'thread-pon', {
      user: inputs.user,
    });

    return {};
  },
};
