const MarkdownIt = require('markdown-it');
const plainText = require('markdown-it-plain-text');

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
      if (!inputs.markdown) {
        return '';
      }

      var md = new MarkdownIt();
      md.use(plainText);
      md.render(inputs.markdown);
      var raw = md.plainText;

      var chars = Array.from(raw);
      if (chars.length > inputs.max) {
        return chars.slice(0, inputs.max).join('') + '...';
      }
      return raw;
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
