module.exports = {
  friendlyName: 'Delete user',

  description: 'Delete user api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
    isNologin: {
      statusCode: 405,
      description: 'The provided this item is Sandbox.',
    },
    using: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
    lastOneAdmin: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
    nowLogedin: {
      statusCode: 405,
      description: 'The provided this item is now using.',
    },
  },

  fn: async function (inputs) {
    if (inputs.id === this.req.me.id) {
      throw 'nowLogedin';
    }

    var current = await User.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    });
    if (!current) {
      throw 'notFound';
    }

    if (current.isNologin) {
      throw 'isNologin';
    }

    var adminQty = await User.count({
      id: { '!=': inputs.id },
      isSuperAdmin: true,
      organization: this.req.organization.id,
    });
    if (adminQty < 2) {
      throw 'lastOneAdmin';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await User.destroyOne({
          id: current.id,
        }).usingConnection(db);

        sails.log.info(`ユーザー [ ${current.id} : ${current.fullName} ] を削除しました。`);
        this.req.session.effectMessage = sails.__('Removed the user {0}').format(current.fullName);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
