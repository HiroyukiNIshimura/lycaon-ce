module.exports = {
  friendlyName: 'thread edit out',
  description: 'thread edit out.',
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

    var message = {
      key: '{0} [{1}] has finished editing this thread',
      params: [this.req.me.fullName, this.req.me.emailAddress],
    };

    sails.sockets.broadcast(room, 'thread-edit-out', {
      message: message,
      user: this.req.me,
      threadId: thread.id,
    });

    return {};
  },
};
