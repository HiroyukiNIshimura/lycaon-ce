module.exports = {
  friendlyName: 'Update my organization',

  description: '',

  inputs: {
    name: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    emailAddress: {
      type: 'string',
      required: true,
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
    },
    fullName: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 120;
      },
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
    try {
      var current = await Organization.findOne({ id: this.req.organization.id });
      if (!current) {
        throw 'notFound';
      }

      var valueToSet = _.extend({}, inputs);

      await sails.getDatastore().transaction(async (db) => {
        await Organization.updateOne({ id: this.req.organization.id }).set(valueToSet).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated organization information');

    return {};
  },
};
