module.exports = {
  friendlyName: 'wiki edit query',
  description: 'wiki edit query.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    queryUser: {
      type: 'ref',
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

      var message = {
        key: '{0} [{1}] has entered the edit of this wiki',
        params: [this.req.me.fullName, this.req.me.emailAddress],
      };

      if (inputs.queryResponse) {
        message = {
          key: '{0} [{1}] is editing this wiki',
          params: [this.req.me.fullName, this.req.me.emailAddress],
        };
      }

      var room = `room-${this.req.organization.id}-wiki-${wiki.id}`;
      sails.sockets.broadcast(room, 'wiki-edit-in', {
        message: message,
        user: this.req.me,
        queryUser: inputs.queryUser,
      });
    }

    return {};
  },
};
