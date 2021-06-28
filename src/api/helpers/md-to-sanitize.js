const sanitizeHtml = require('sanitize-html');

module.exports = {
  friendlyName: 'mdToSanitize',
  description: 'sanitized markdown.',
  inputs: {
    markdown: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      return sanitizeHtml(await sails.helpers.mdToHtml.with({ markdown: inputs.markdown }), {
        allowedTags: [],
        allowedAttributes: {},
        exclusiveFilter: function (frame) {
          return !frame.text.trim();
        },
      });
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
