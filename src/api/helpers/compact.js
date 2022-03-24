const { isPlainObject } = require('is-plain-object');
const filter = require('deep-filter');

module.exports = {
  friendlyName: 'Compact',

  description: 'Compact something.',

  inputs: {
    value: {
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    const ignores = [
      'password',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
      'emailProofToken',
      'emailProofTokenExpiresAt',
      'tosAcceptedByIp',
      'qWords',
      'rawData',
      'userAgent',
      'clientIp',
      //'gitPassword',
      //'gitlabToken',
    ];
    return filter(inputs.value, (value, prop) => {
      if (ignores.indexOf(prop) > -1) {
        return false;
      }
      return true;
    });
  },
};
