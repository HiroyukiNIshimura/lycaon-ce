module.exports = {
  friendlyName: 'thread in',
  description: 'thread in.',
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

    var message = {};

    if (inputs.navigation !== 'reload') {
      message = {
        key: '{0} [{1}] has joined this thread',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };
    }

    var room = `room-${this.req.organization.id}-thread-${thread.id}`;
    sails.sockets.join(this.req, room, (err) => {
      if (!err) {
        sails.sockets.broadcast(room, 'thread-in', {
          message: message,
          user: this.req.me,
        });
      }
    });

    return {};
  },
};
