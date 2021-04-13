module.exports = {
  friendlyName: 'Get plan list for Backoffice API',
  description: 'Get plan list for Backoffice API.',

  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
  },

  fn: async function () {
    return _.keys(sails.config.custom.plans);
  },
};
