module.exports = {
  friendlyName: 'get message',
  description: 'get message.',
  inputs: {
    me: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var results = [];

    var list = await Message.find({
      where: { sendTo: inputs.me.id, readAt: null },
      sort: 'createdAt DESC',
      limit: 50,
    }).populate('sendFrom');

    for (let entry of list) {
      results.push({
        message: {
          key: 'Received a new message from {0}',
          params: [entry.sendFrom.fullName],
        },
        data: entry,
        timespan: entry.createdAt,
      });
    }

    return results;
  },
};
