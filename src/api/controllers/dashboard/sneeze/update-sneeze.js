module.exports = {
  friendlyName: 'Update Sneeze',
  description: 'Update the Sneeze for the logged-in user.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    comment: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Sneeze successfully updated.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Sneeze.findOne({
      id: inputs.id,
    }).populate('thread');
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var emotional = await sails.helpers.emotionCheck.with({ contents: inputs.comment });
    var sneeze = {
      comment: inputs.comment,
      emotional: JSON.stringify(emotional),
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Sneeze.updateOne({
          id: current.id,
        })
          .set(sneeze)
          .usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'update-sneeze',
          user: this.req.me,
          thread: current.thread,
          sneezeId: current.id,
          req: this.req,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated comments');

    return {};
  },
};
