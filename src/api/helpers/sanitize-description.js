const sanitizeHtml = require('sanitize-html');

module.exports = {
  friendlyName: 'sanitizeDescription',
  description: 'sanitizeed wiki description.',
  inputs: {
    markdown: {
      type: 'string',
    },
    max: {
      type: 'number',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      var text = '';
      var i = 0;
      for (let row of inputs.markdown.split(/\n/)) {
        text += row + '\n';
        if (text.length > inputs.max) {
          text = text.substring(0, inputs.max) + '...';
          break;
        }
        i++;
        if (i >= 10) {
          break;
        }
      }

      return sanitizeHtml(await sails.helpers.mdToHtml.with({ markdown: text }), {
        allowedTags: [],
        allowedAttributes: {},
        exclusiveFilter: function (frame) {
          return !frame.text.trim();
        },
      });
    } catch (err) {
      sails.log.debug(err);
    }
    return inputs.markdown;
  },
};
