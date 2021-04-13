module.exports = {
  friendlyName: 'Updte Milestones order',

  description: 'Updte Milestones order.',

  inputs: {
    orderSet: {
      type: 'ref',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a milestones that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (inputs.orderSet.length < 1) {
      return {};
    }

    var teamid = inputs.orderSet[0].team;
    for (let entry of inputs.orderSet) {
      if (entry.team !== teamid) {
        throw 'notFound';
      }
    }

    var team = await sails.helpers.validateMembership.with({
      id: teamid,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var milestones = [];

    try {
      await sails.getDatastore().transaction(async (db) => {
        var line = 1;
        for (let entry of inputs.orderSet) {
          var updated = await Milestone.updateOne({
            id: entry.id,
          })
            .set({ lineNo: line })
            .usingConnection(db);

          milestones.push(updated);
          line++;
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return { milestones: milestones };
  },
};
