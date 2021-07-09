module.exports = {
  friendlyName: 'Create category',

  description: 'Create category api.',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    useTemplate: {
      type: 'boolean',
    },
    templateSubject: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    templateBody: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided name is already in use.',
    },
  },

  fn: async function (inputs) {
    var sames = await Category.count({ name: inputs.name, organization: this.req.organization.id });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    var created = {};

    var valuesToSet = {
      name: inputs.name,
      useTemplate: inputs.useTemplate,
      templateSubject: inputs.templateSubject,
      templateBody: inputs.templateBody,
      organization: this.req.organization.id,
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        var max = await Category.find({
          where: { organization: this.req.organization.id },
          sort: 'displayOrder DESC',
          limit: 1,
        });
        if (max.length > 0) {
          valuesToSet.displayOrder = max[0].displayOrder + 1;
        } else {
          valuesToSet.displayOrder = 1;
        }
        created = await Category.create(valuesToSet).fetch().usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('You have created a category {0}').format(valuesToSet.name);

    return {
      id: created.id,
      name: created.name,
    };
  },
};
