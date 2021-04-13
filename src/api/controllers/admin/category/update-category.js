module.exports = {
  friendlyName: 'Update category',

  description: 'Update category api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    useTemplate: {
      type: 'boolean',
    },
    templateSubject: {
      type: 'string',
    },
    templateBody: {
      type: 'string',
    },
    deleted: {
      type: 'boolean',
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
    var current = await Category.findOne({ id: inputs.id, organization: this.req.organization.id });
    if (!current) {
      throw 'notFound';
    }

    var sames = await Category.count({
      name: inputs.name,
      id: { '!=': inputs.id },
      organization: this.req.organization.id,
    });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    try {
      var valuesToSet = {
        name: inputs.name,
        useTemplate: inputs.useTemplate,
        templateSubject: inputs.templateSubject,
        templateBody: inputs.templateBody,
        deleted: inputs.deleted,
      };

      await sails.getDatastore().transaction(async (db) => {
        await Category.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated the category {0}').format(valuesToSet.name);

    return { id: current.id };
  },
};
