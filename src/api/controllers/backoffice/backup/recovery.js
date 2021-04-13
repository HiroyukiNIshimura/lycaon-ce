const dbdumper = require('../../../../jobs/db-dump');

module.exports = {
  friendlyName: 'Database recovery',

  description: 'Database recovery.',

  inputs: {
    filename: {
      type: 'string',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Successfully Database Recovery.',
    },
  },

  fn: async function (inputs) {
    try {
      await dbdumper.recovery(inputs.filename);

      this.req.session.effectMessage = sails.__('Performed database recovery');
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
