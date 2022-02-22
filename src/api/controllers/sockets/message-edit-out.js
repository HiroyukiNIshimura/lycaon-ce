module.exports = {
  friendlyName: 'thread edit out',
  description: 'thread edit out.',
  inputs: {
    partner: {
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
    var partner = await User.findOne({ id: inputs.partner });
    if (partner.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var room = `room-${this.req.organization.id}-lycaon`;
    sails.sockets.broadcast(room, 'message-edit-out', {
      partner: inputs.partner,
      me: this.req.me,
    });

    return {};
  },
};
