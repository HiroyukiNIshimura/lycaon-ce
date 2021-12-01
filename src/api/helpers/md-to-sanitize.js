const MarkdownIt = require('markdown-it');
const plainText = require('markdown-it-plain-text');

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
      if (!inputs.markdown) {
        return '';
      }

      var md = new MarkdownIt();
      md.use(plainText);
      md.render(inputs.markdown);
      return md.plainText;
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
