module.exports = {
  friendlyName: 'Update wiki fans',
  description: 'Update the wiki fans.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    state: {
      type: 'boolean',
    },
    flagColor: {
      type: 'string',
      allowNull: true,
    },
  },
  exits: {
    success: {
      description: `Wiki's status successfully updated.`,
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a wiki that has not joined.',
    },
  },

  fn: async function (inputs) {
    var wiki = await Wiki.findOne({
      id: inputs.id,
    });
    if (!wiki) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: wiki.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        var flag = await WikiFlag.findOne({ user: this.req.me.id, wiki: wiki.id }).usingConnection(db);
        if (inputs.state) {
          if (flag) {
            await WikiFlag.updateOne({ id: flag.id }).set({ color: inputs.flagColor }).usingConnection(db);
          } else {
            await WikiFlag.create({
              user: this.req.me.id,
              wiki: wiki.id,
              color: inputs.flagColor,
            }).usingConnection(db);
          }
        } else {
          if (flag) {
            await WikiFlag.destroyOne({ id: flag.id }).usingConnection(db);
          }
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated the flag');

    return {};
  },
};
