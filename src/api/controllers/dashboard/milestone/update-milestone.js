module.exports = {
  friendlyName: 'Update Milestone',

  description: 'Update Milestone api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    startAt: {
      type: 'number',
    },
    endAt: {
      type: 'number',
    },
    user: {
      type: 'number',
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided name is already in use.',
    },
  },

  fn: async function (inputs) {
    var current = await Milestone.findOne({ id: inputs.id });
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var sames = await Milestone.count({
      name: inputs.name,
      team: current.team,
      id: { '!=': inputs.id },
    });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    var startAt;
    var duration;

    if (inputs.startAt) {
      startAt = inputs.startAt;
    }
    if (inputs.endAt && inputs.startAt) {
      duration = inputs.endAt - inputs.startAt;
    }

    try {
      var valuesToSet = {
        name: inputs.name,
        startAt: startAt,
        duration: duration,
      };

      if (inputs.user) {
        valuesToSet.user = inputs.user;
      } else {
        valuesToSet.user = undefined;
      }

      await sails.getDatastore().transaction(async (db) => {
        await Milestone.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated milestone {0}').format(valuesToSet.name);

    return { team: current.team };
  },
};
