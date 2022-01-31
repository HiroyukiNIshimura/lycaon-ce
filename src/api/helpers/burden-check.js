module.exports = {
  friendlyName: 'sails.helpers.burdenCheck',

  description: 'Burden check',

  inputs: {
    team: {
      type: 'ref',
      required: true,
    },
    user: {
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    var loadQty = await Thread.count().where({
      team: inputs.team.id,
      responsible: inputs.user.id,
      status: 0,
      concept: 1,
      local: false,
    });

    var numberOfThreadsBurden = inputs.team.numberOfThreadsBurden;

    if (loadQty > numberOfThreadsBurden * 1.2) {
      return {
        loadQty: loadQty,
        mold: 6,
      };
    }
    if (loadQty > numberOfThreadsBurden * 1.1) {
      return {
        loadQty: loadQty,
        mold: 5,
      };
    }
    if (loadQty > numberOfThreadsBurden) {
      return {
        loadQty: loadQty,
        mold: 4,
      };
    }
    if (loadQty > numberOfThreadsBurden * 0.95) {
      return {
        loadQty: loadQty,
        mold: 3,
      };
    }
    if (loadQty > numberOfThreadsBurden * 0.9) {
      return {
        loadQty: loadQty,
        mold: 2,
      };
    }
    if (loadQty > numberOfThreadsBurden * 0.85) {
      return {
        loadQty: loadQty,
        mold: 1,
      };
    }

    return {
      loadQty: loadQty,
      mold: 0,
    };
  },
};
