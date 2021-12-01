const CRC32 = require('crc-32');

module.exports = {
  friendlyName: 'stringFromColor',

  description: 'String from color',

  inputs: {
    str: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    try {
      var hash = CRC32.str(inputs.str);
      var buf = Buffer.allocUnsafe(4);
      buf.writeUInt32LE(hash, 0);
      return {
        r: buf[0] & 0xff,
        g: buf[1] & 0xff,
        b: buf[2] & 0xff,
      };
    } catch (error) {
      sails.log.error(error);
      return {
        r: 0,
        g: 0,
        b: 0,
      };
    }
  },
};
