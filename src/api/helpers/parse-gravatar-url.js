/**
 * Sailsのhelperにあったけどどうしよう
 */
module.exports = {
  friendlyName: 'parseGravatarUrl',
  description: 'Create Gravatar Url.',
  inputs: {
    email: {
      type: 'string',
      description: 'emailAddress',
      isEmail: true,
      required: true,
    },
    size: {
      type: 'number',
      description: 'image size',
      defaultsTo: 42,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var md5hex = require('crypto').createHash('md5').update(inputs.email, 'binary').digest('hex');
    return 'https://www.gravatar.com/avatar/' + md5hex + '?s=' + inputs.size;
  },
};
