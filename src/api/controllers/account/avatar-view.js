const path = require('path'),
  fs = require('fs');

module.exports = {
  friendlyName: 'View User Avatar',
  description: 'View the user Avatar for the logged-in user.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    fileId: {
      type: 'string',
      required: true,
    },
    ext: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'View Avatar successfully.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var user = await User.findOne({
      id: inputs.id,
    });
    if (!user) {
      throw 'notFound';
    }

    var target = path.resolve(sails.config.appPath, 'avatar', String(inputs.id), inputs.fileId);
    if (inputs.ext) {
      target = target + '.' + inputs.ext;
    }

    if (!fs.existsSync(target)) {
      throw 'notFound';
    }

    try {
      return fs.createReadStream(target);
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
