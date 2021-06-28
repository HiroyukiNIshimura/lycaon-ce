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
    }).populate('fans', { where: { id: this.req.me.id } });
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

    var fans = wiki.fans.map((o) => {
      return o.id;
    });

    if (inputs.state) {
      if (wiki.fans.length < 1) {
        fans.push(this.req.me.id);
      }
    } else {
      fans = _.reject(fans, (entry) => {
        return entry === this.req.me.id;
      });
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Wiki.updateOne({
          id: wiki.id,
        })
          .set({
            fans: fans,
          })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated the flag');

    return {};
  },
};
