module.exports = {
  friendlyName: 'broadcastCommentNotify',
  description: 'Broadcast comments notify.',
  inputs: {
    organizationId: {
      type: 'number',
      required: true,
    },
    threadId: {
      type: 'number',
      required: true,
    },
    fromUser: {
      type: 'ref',
      required: true,
    },
    comment: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var rooms = [`room-${inputs.organizationId}-thread-${inputs.threadId}`];
    var message = {
      key: 'a comment has arrived from {0}',
      params: [inputs.fromUser.fullName],
    };
    sails.sockets.broadcast(rooms, 'comment-notify', {
      message: message,
      user: inputs.fromUser,
      comment: await sails.helpers.sanitizeDescription.with({ markdown: inputs.comment, max: 120 }),
      timespan: Date.now(),
      id: inputs.threadId,
    });
  },
};
