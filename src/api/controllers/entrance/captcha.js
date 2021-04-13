const captcha = require('trek-captcha');
module.exports = {
  friendlyName: 'response captcha',

  description: 'Response captcha.',

  exits: {
    success: {
    },
  },

  fn: async function () {
    var { token, buffer } = await captcha();
    this.req.session.captchaToken = token;
    return { data: buffer.toString('base64') };
  },
};
