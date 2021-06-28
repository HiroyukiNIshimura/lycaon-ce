module.exports = {
  friendlyName: 'message edit in',
  description: 'message edit in.',
  inputs: {
    partner: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a message that has not joined.',
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

    var room = `room-${this.req.organization.id}-lycaon`;

    sails.sockets.broadcast(room, 'message-edit-in', {
      partner: inputs.partner,
      me: this.req.me,
    });

    return {};
  },
};
