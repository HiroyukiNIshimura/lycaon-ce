module.exports = {
  friendlyName: 'thread out',
  description: 'thread out.',
  inputs: {},
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var room = `room-${this.req.organization.id}-thread`;
    sails.sockets.broadcast(room, 'thread-out', {
      user: this.req.me,
    });
    sails.sockets.leave(this.req, room);

    return {};
  },
};
