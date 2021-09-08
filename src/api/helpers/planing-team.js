module.exports = {
  friendlyName: 'planingTeam',
  description: 'planing helper.',
  inputs: {
    organization: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (sails.config.custom.isDemosite) {
      return true;
    }

    var organization = await Organization.findOne({ id: inputs.organization });
    if (!organization) {
      throw 'badRequest';
    }

    var plan = sails.config.custom.plans[organization.plan];
    if (plan.maxUser) {
      var current = await Team.count({ organization: inputs.organization });
      if (plan.maxTeam <= current) {
        return false;
      }
    }
    return true;
  },
};
