const sanitizeHtml = require('sanitize-html');

module.exports = {
  friendlyName: 'sanitizeDescription',
  description: 'sanitized wiki description.',
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
        var chars = Array.from(text);
        if (chars.length > inputs.max) {
          text = chars.slice(0, inputs.max).join('') + '...';
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
