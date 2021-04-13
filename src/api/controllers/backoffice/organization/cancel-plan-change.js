module.exports = {
  friendlyName: 'cancel plan change',

  description: 'cancel plan change.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
  },
  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Billing.findOne({ organization: inputs.id });
    if (!current) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Billing.updateOne({
          id: current.id,
        })
          .set({ planChangeAt: null })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('The plan change request has been cancelled');

    return { id: current.organization };
  },
};
