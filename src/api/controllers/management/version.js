module.exports = {
  friendlyName: 'Get version for Backoffice API',
  description: 'Get version for Backoffice API.',

  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
  },

  fn: async function () {
    var status = await SysStatus.findOne({ id: 1 });

    return { version: status.version };
  },
};
