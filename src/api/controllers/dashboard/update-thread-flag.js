module.exports = {
  friendlyName: 'Update thread fans',
  description: 'Update the thread fans.',
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
      description: `Thread's status successfully updated.`,
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var thread = await Thread.findOne({
      id: inputs.id,
    }).populate('fans', { where: { id: this.req.me.id } });
    if (!thread) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var index = _.findIndex(thread.fans, { id: this.req.me.id });
    if (inputs.state && index > -1) {
      return;
    }

    if (!inputs.state && index < 0) {
      return;
    }

    var fans = thread.fans.map((o) => {
      return o.id;
    });

    if (inputs.state) {
      if (thread.fans.length < 1) {
        fans.push(this.req.me.id);
      }
    } else {
      fans = _.reject(fans, (entry) => {
        return entry === this.req.me.id;
      });
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Thread.updateOne({
          id: thread.id,
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
