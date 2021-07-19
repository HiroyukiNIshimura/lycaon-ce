const removeMd = require('remove-markdown');

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

      var raw = removeMd(inputs.markdown, {
        stripListLeaders: false,
        listUnicodeChar: '',
        gfm: true,
        useImgAltText: true,
      });
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
