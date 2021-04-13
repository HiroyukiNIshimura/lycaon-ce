module.exports = {
  friendlyName: 'cancel unsubscribed',

  description: 'cancel unsubscribed.',
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
          .set({ unsubscribedAt: null })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('The unsubscribed request has been cancelled');

    return { id: current.organization };
  },
};
