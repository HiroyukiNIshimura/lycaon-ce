module.exports = {
  friendlyName: 'Update policy for Backoffice API',
  description: 'Update policy for Backoffice API.',

  inputs: {
    contents: {
      type: 'string',
      required: true,
      description: 'コンテンツのbase64',
    },
    enactmentAt: {
      type: 'number',
    },
    contentType: {
      type: 'string',
      isIn: ['user', 'privacy'],
    },
  },
  exits: {
    success: {},
  },

  fn: async function (inputs) {
    try {
      var contents = Buffer.from(inputs.contents, 'base64');

      if (inputs.contentType === 'user') {
        await Policy.updateOne({ id: 1 }).set({
          user: contents,
          userAt: inputs.enactmentAt,
        });
      } else {
        await Policy.updateOne({ id: 1 }).set({
          privacy: contents,
          privacyAt: inputs.enactmentAt,
        });
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
