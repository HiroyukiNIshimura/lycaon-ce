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
    if (!this.req.isSocket) {
      return 'notFound';
    }
    if (!this.req.me) {
      return 'notFound';
    }

    var wiki = await Wiki.findOne({
      id: inputs.id,
    });
    if (!wiki) {
      throw 'notFound';
    }

    if (wiki.concept === 0) {
      if (!this.req.organization) {
        return 'notFound';
      }

      var team = await sails.helpers.validateMembership.with({
        id: wiki.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }
      if (team.organization !== this.req.organization.id) {
        throw 'notFound';
      }

      var room = `room-${this.req.organization.id}-wiki-${wiki.id}`;

      var message = {
        key: '{0} [{1}] has finished editing this wiki',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };

      sails.sockets.broadcast(room, 'wiki-edit-out', {
        message: message,
        user: this.req.me,
      });
    }

    return {};
  },
};
