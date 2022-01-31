module.exports = {
  friendlyName: 'thread edit query',
  description: 'thread edit query.',
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

    var room = `room-${this.req.organization.id}-thread`;
    sails.sockets.broadcast(room, 'thread-edit-query', {
      user: this.req.me,
      threadId: thread.id,
    });

    return {};
  },
};
