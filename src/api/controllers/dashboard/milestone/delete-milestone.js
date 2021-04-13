module.exports = {
  friendlyName: 'Delete Milestone',

  description: 'Delete Milestone api.',

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
  },

  fn: async function (inputs) {
    var current = await Milestone.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Milestone.destroyOne({
          id: current.id,
        }).usingConnection(db);

        sails.log.info(`マイルストーン[ ${current.id} : ${current.name} ] を削除しました。`);
        this.req.session.effectMessage = sails.__('Removed milestone {0}').format(current.name);
      });

      return { team: team.id };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
