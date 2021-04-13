const path = require('path');
const fs = require('fs');

module.exports = {
  friendlyName: 'Download backup file',
  description: 'Download backup file.',

  inputs: {
    filename: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Successfully Download backup file.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a item that has not joined.',
    },
  },

  fn: async function (inputs) {
    var backupDir = path.resolve(sails.config.appPath, 'backup');
    var target = path.join(backupDir, inputs.filename);

    try {
      this.res.attachment(inputs.filename);
      var downloading = await sails.startDownload(target);
      return downloading;
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
