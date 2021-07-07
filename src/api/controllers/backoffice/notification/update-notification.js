module.exports = {
  friendlyName: 'update notification',

  description: 'update notification.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    subject: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    body: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 5000;
      },
    },
    postingAt: {
      type: 'number',
      required: true,
    },
    category: {
      type: 'string',
      isIn: ['notice', 'important', 'maintenance'],
      defaultsTo: 'notice',
    },
    deleted: {
      type: 'boolean',
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a notification that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await SysNotification.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    try {
      var valuesToSet = {
        category: inputs.category,
        subject: inputs.subject,
        body: inputs.body,
        postingAt: inputs.postingAt,
        deleted: inputs.deleted,
      };

      await sails.getDatastore().transaction(async (db) => {
        await SysNotification.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated system notifications');

    return { id: current.id };
  },
};
