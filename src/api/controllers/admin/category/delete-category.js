module.exports = {
  friendlyName: 'Delete category',

  description: 'Delete category api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    isSandbox: {
      statusCode: 405,
      description: 'The provided this item is Sandbox.',
    },
    using: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
  },

  fn: async function (inputs) {
    var current = await Category.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    }).populate('threads');
    if (!current) {
      throw 'notFound';
    }
    if (current.isSandbox) {
      throw 'isSandbox';
    }

    if (current.threads && current.threads.length > 0) {
      throw 'using';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Category.destroyOne({
          id: current.id,
        }).usingConnection(db);

        sails.log.info(`カテゴリ[ ${current.id} : ${current.name} ] を削除しました。`);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
