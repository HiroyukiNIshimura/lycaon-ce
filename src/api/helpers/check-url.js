const axios = require('axios');

module.exports = {
  friendlyName: 'check url',
  description: 'check url utility.',
  inputs: {
    url: {
      type: 'string',
      description: 'target url',
    },
    headers: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (!inputs.url) {
      return false;
    }

    try {
      await axios.get(inputs.url, { headers: inputs.headers, data: {} });
      return true;
    } catch (err) {
      sails.log.debug({ url: inputs.url, error: err });
    }
    return false;
  },
};
