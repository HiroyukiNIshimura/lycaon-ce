module.exports = {
  friendlyName: 'Read messages',

  description: 'Read messages.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'message.id',
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
  },

  fn: async function (inputs) {
    var message = await Message.findOne({ id: inputs.id }).populate('organization');
    if (!message) {
      throw 'notFound';
    }
    if (message.organization.id !== this.req.me.organization.id) {
      throw 'notFound';
    }

    if (message.sendFrom === this.req.me.id) {
      sails.log.debug(`${message.id}:送信元が自分`);
      return {};
    }

    if (message.readAt) {
      sails.log.debug(`${message.id}:既読判定`);
      return {};
    }

    var updated = {};
    await sails.getDatastore().transaction(async (db) => {
      updated = await Message.updateOne({ id: message.id })
        .set({ readAt: Date.now() })
        .usingConnection(db);
    });

    var sendTo = await User.findOne({ id: updated.sendTo });

    var rooms = [`room-${this.req.organization.id}-lycaon`];

    sails.sockets.broadcast(rooms, 'message-read', {
      data: updated,
      sendTo: sendTo,
      timespan: Date.now(),
    });

    return {};
  },
};
