module.exports = {
  friendlyName: 'Set plan organization for Backoffice API',
  description: 'Set plan organization for Backoffice API.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
      description: 'プラン',
    },
  },
  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Organization.findOne({ id: inputs.id });
    if (!current) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Organization.updateOne({ id: inputs.id })
          .set({ plan: inputs.plan })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var updated = await Billing.find({
      organization: current.id,
    }).populate('organization');

    return { billing: updated[0] };
  },
};
