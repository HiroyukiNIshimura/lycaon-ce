const crypto = require('crypto');

module.exports = {
  friendlyName: 'encryptoString',
  description: 'encrypto string.',
  inputs: {
    plane: {
      type: 'string',
      description: 'plane text',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (!inputs.plane) {
      return '';
    }

    var iv = Buffer.from(sails.config.custom.simpleCrypto.bufferKey);
    var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sails.config.custom.simpleCrypto.encryptionKey), iv);
    var encrypted = cipher.update(inputs.plane);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
  },
};
