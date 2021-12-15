module.exports = {
  friendlyName: 'thread edit in',
  description: 'thread edit in.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    queryUser: {
      type: 'json',
    },
    queryResponse: {
      type: 'boolean',
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

    var room = `room-${this.req.organization.id}-thread-${thread.id}`;

    var message = {
      key: '{0} [{1}] has entered editing this thread',
      params: [this.req.me.fullName, this.req.me.emailAddress],
    };

    if (inputs.queryResponse) {
      message = {
        key: '{0} [{1}] is editing this thread',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };
    }

    sails.sockets.broadcast(room, 'thread-edit-in', {
      message: message,
      user: this.req.me,
      queryUser: inputs.queryUser,
    });

    return {};
  },
};
