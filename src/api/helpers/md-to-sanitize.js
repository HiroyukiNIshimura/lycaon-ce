const removeMd = require('remove-markdown');

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

      return removeMd(inputs.markdown, {
        stripListLeaders: false,
        listUnicodeChar: '',
        gfm: true,
        useImgAltText: true,
      });
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
