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
    usingThread: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
    usingTeam: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
  },

  fn: async function (inputs) {
    var current = await Category.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    })
      .populate('threads')
      .populate('teams');

    if (!current) {
      throw 'notFound';
    }

    if (current.threads && current.threads.length > 0) {
      throw 'usingThread';
    }

    if (current.teams && current.teams.length > 0) {
      throw 'usingTeam';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Category.destroyOne({
          id: current.id,
        }).usingConnection(db);

        var categories = await Category.find({
          where: { organization: this.req.organization.id },
          sort: 'displayOrder ASC',
        }).usingConnection(db);

        var i = 1;
        for (let category of categories) {
          await Category.updateOne({
            id: category.id,
            organization: this.req.organization.id,
          })
            .set({ displayOrder: i })
            .usingConnection(db);

          i++;
        }

        sails.log.info(`カテゴリ[ ${current.id} : ${current.name} ] を削除しました。`);
        this.req.session.effectMessage = sails.__('Removed the category {0}').format(current.name);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
