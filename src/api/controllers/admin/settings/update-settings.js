module.exports = {
  friendlyName: 'Update settings',

  description: 'Update settings.',

  inputs: {
    weeklyReportDay: {
      type: 'number',
      isIn: [0, 1, 2, 3, 4, 5, 6],
      min: 0,
      max: 6,
      isInteger: true,
      required: true,
    },
    maxUploadFileSize: {
      type: 'number',
      min: 0,
      max: 1024 * 1024 * 500,
      required: true,
    },
    witeListOfExts: {
      type: 'string',
      example: 'png,zip,pdf',
    },
    notMailSend: {
      type: 'boolean',
    },
    notSendBackoffice: {
      type: 'boolean',
    },
    internalEmailAddress: {
      type: 'string',
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
    },
    fromEmailAddress: {
      type: 'string',
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
    },
    fromName: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    workingHoursPerDay: {
      type: 'number',
      defaultsTo: 8,
      isInteger: true,
      max: 24,
      min: 1,
    },
  },
  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    try {
      var current = await SysSettings.findOne({ organization: this.req.organization.id });
      if (!current) {
        throw 'notFound';
      }

      var valueToSet = _.extend({}, inputs);
      valueToSet.lastUpdateUser = this.req.me.id;
      if (this.req.organization.plan === 'free' || this.req.organization.plan === 'pine') {
        delete valueToSet.maxUploadFileSize;
      }

      await sails.getDatastore().transaction(async (db) => {
        await SysSettings.updateOne({ id: current.id }).set(valueToSet).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated system settings');

    return {};
  },
};
