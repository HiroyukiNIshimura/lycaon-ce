module.exports = {
  friendlyName: 'Update "wiki" deleted',

  description: 'Update "Wiki" deleted.',
  inputs: {
    id: {
      type: 'number',
      required: true,
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
  },

  fn: async function (inputs) {
    var current = await Wiki.findOne({
      id: inputs.id,
    }).populate('team');
    if (!current) {
      throw 'notFound';
    }
    if (current.team.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Wiki.updateOne({
          id: current.id,
        })
          .set({ deleted: inputs.deleted })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    if (inputs.deleted) {
      this.req.session.effectMessage = sails.__('I made the Wiki private');
    } else {
      this.req.session.effectMessage = sails.__('The Wiki has been released');
    }

    return {};
  },
};
