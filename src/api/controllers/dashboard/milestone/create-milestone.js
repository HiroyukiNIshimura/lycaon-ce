module.exports = {
  friendlyName: 'Create milestone',

  description: 'Create milestone api.',

  inputs: {
    team: {
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
    var team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var sames = await Milestone.count({ name: inputs.name, team: inputs.team });
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

    var created = {};

    try {
      var valuesToSet = {
        team: inputs.team,
        name: inputs.name,
        startAt: startAt,
        duration: duration,
        progress: 0,
      };

      if (inputs.user) {
        valuesToSet.user = inputs.user;
      }

      await sails.getDatastore().transaction(async (db) => {
        var max = await Milestone.find({ sort: 'lineNo DESC', limit: 1 });
        if (max.length > 0) {
          valuesToSet.lineNo = max[0].lineNo + 1;
        } else {
          valuesToSet.lineNo = 1;
        }
        created = await Milestone.create(valuesToSet).fetch().usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var effectMessage = sails.__('You have created a milestone {0}');
    this.req.session.effectMessage = effectMessage.format(valuesToSet.name);

    return {
      team: created.team,
    };
  },
};
