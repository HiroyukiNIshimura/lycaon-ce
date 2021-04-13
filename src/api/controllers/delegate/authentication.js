module.exports = {
  friendlyName: 'Authentication for Backoffice API',
  description: 'Authentication for Backoffice API.',

  inputs: {
    secret: {
      type: 'string',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
    forbidden: {
      responseType: 'forbidden',
    },
  },

  fn: async function (inputs) {
    if (sails.config.custom.backoffice.secret !== inputs.secret) {
      throw 'forbidden';
    }
    return {};
  },
};
