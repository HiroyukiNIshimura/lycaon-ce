const crypto = require('crypto');

module.exports = {
  friendlyName: 'decrypto string',
  description: 'decrypto string.',
  inputs: {
    encrypto: {
      type: 'string',
      description: 'encrypto text',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (!inputs.encrypto) {
      return '';
    }

    var iv = Buffer.from(sails.config.custom.simpleCrypto.bufferKey);
    var encryptedText = Buffer.from(inputs.encrypto, 'hex');
    var decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(sails.config.custom.simpleCrypto.encryptionKey),
      iv
    );
    var decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },
};
