/**
 * is-socket
 */
module.exports = async function (req, res, proceed) {
  if (!req.isSocket) {
    return res.notfound();
  }
  if (!req.me) {
    return res.notfound();
  }
  if (!req.organization) {
    return res.notfound();
  }

  return proceed();
};
