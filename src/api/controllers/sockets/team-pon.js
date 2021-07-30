module.exports = {
  friendlyName: 'team pon',
  description: 'team pon.',
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
    var team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: inputs.user,
    });
    if (!team) {
      throw 'notFound';
    }
    if (team.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var room = `room-${this.req.organization.id}-team-${inputs.id}`;
    sails.sockets.broadcast(room, 'team-pon', {
      user: inputs.user,
    });

    return {};
  },
};
