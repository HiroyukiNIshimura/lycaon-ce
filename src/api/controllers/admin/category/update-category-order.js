module.exports = {
  friendlyName: 'Updte categories order',

  description: 'Updte categories order.',

  inputs: {
    orderSet: {
      type: 'json',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (inputs.orderSet.length < 1) {
      return {};
    }

    var categories = [];

    try {
      await sails.getDatastore().transaction(async (db) => {
        for (let entry of inputs.orderSet) {
          var updated = await Category.updateOne({
            id: entry.id,
            organization: this.req.organization.id,
          })
            .set({ displayOrder: entry.displayOrder })
            .usingConnection(db);

          categories.push(updated);
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return { categories: categories };
  },
};
