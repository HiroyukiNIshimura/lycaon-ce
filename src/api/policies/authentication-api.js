module.exports = async function (req, res, proceed) {
  var secret = req.headers['x-api-secret'];
  if (!secret) {
    return res.forbidden();
  }

  if (sails.config.custom.backoffice.secret !== secret) {
    return res.unauthorized();
  }

  return proceed();
};
