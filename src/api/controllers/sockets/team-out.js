module.exports = {
  friendlyName: 'team out',
  description: 'team out.',
  inputs: {},
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a team that has not joined.',
    },
  },

  fn: async function (inputs) {
    var room = `room-${this.req.organization.id}-team`;
    sails.sockets.broadcast(room, 'team-out', {
      user: this.req.me,
    });
    sails.sockets.leave(this.req, room);

    return {};
  },
};
