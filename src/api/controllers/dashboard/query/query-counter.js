module.exports = {
  friendlyName: 'Query counter',
  description: 'Query counter.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
    },
  },
  exits: {
    success: {
      description: 'Query threads successfully.',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {};

    try {
      var user = await User.findOne({
        id: this.req.me.id,
      })
        .populate('organization')
        .populate('teams', { where: { deleted: false } })
        .populate('threadFlags');

      if (inputs.id) {
        response.counter = await sails.helpers.storage.queryCounter.with({
          team: inputs.id,
          flags: user.threadFlags.map((o) => {
            return o.thread;
          }),
          user: user,
        });
      } else {
        response.counter = await sails.helpers.storage.queryCounter.with({
          team: user.teams.map((o) => {
            return o.id;
          }),
          flags: user.threadFlags.map((o) => {
            return o.thread;
          }),
          user: user,
        });
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
