module.exports = {
  friendlyName: 'Send mail for Created thread',
  description: 'Send mail for Created thread.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Thread successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    try {
      var thread = await Thread.findOne({
        id: inputs.id,
      }).populate('owner');
      if (!thread) {
        throw 'notFound';
      }

      await sails.getDatastore().transaction(async (db) => {
        await sails.helpers.sendThreadMailWrapper.with({
          thread: thread.id,
          action: 'create',
          db: db
        });
      });

      return {};
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
