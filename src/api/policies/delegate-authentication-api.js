const axios = require('axios');

module.exports = async function (req, res, proceed) {
  var secret = req.headers['x-api-secret'];
  if (!secret) {
    return res.forbidden();
  }

  var url = new URL(`${sails.config.custom.backoffice.authServer}/api/v1/management/auth`);

  try {
    await axios.post(url.href, { secret: secret });
  } catch (err) {
    sails.log.debug({ url: url.href, error: err });
    return res.forbidden();
  }

  return proceed();
};
