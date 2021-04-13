module.exports = {
  friendlyName: 'Delete wiki',

  description: 'Delete "Wiki" page.',
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
    unauthorized: {
      statusCode: 405,
      description: 'The provided name is already in use.',
    },
  },

  /**
   * 論理削除
   * @param {*} inputs
   */
  fn: async function (inputs) {
    var current = await Wiki.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    if (!this.req.me.isSuperAdmin && current.concept === 1) {
      throw 'unauthorized';
    }

    if (current.concept === 0) {
      var team = await sails.helpers.validateMembership.with({
        id: current.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Wiki.updateOne({
          id: current.id,
        })
          .set({ deleted: true })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
