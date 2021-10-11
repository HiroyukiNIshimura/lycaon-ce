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
    flagColor: {
      type: 'string',
      allowNull: true,
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
    });
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

    try {
      await sails.getDatastore().transaction(async (db) => {
        var flag = await ThreadFlag.findOne({ user: this.req.me.id, thread: thread.id }).usingConnection(db);
        if (inputs.state) {
          if (flag) {
            await ThreadFlag.updateOne({ id: flag.id }).set({ color: inputs.flagColor }).usingConnection(db);
          } else {
            await ThreadFlag.create({
              user: this.req.me.id,
              thread: thread.id,
              color: inputs.flagColor,
            }).usingConnection(db);
          }
        } else {
          if (flag) {
            await ThreadFlag.destroyOne({ id: flag.id }).usingConnection(db);
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
