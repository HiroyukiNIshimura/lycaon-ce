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
      description: 'The user has accessed a thread that has not joined.',
    },
    isSandbox: {
      statusCode: 405,
      description: 'The provided this item is Sandbox.',
    },
  },

  fn: async function (inputs) {
    var current = await Team.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    });
    if (!current) {
      throw 'notFound';
    }
    if (current.isSandbox) {
      throw 'isSandbox';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Team.destroyOne({
          id: current.id,
        }).usingConnection(db);

        sails.log.info(`チーム [ ${current.id} : ${current.name} ] を削除しました。`);
        this.req.session.effectMessage = sails.__('Removed the team {0}').format(current.name);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
