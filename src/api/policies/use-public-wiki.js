/**
 * use-public-wiki
 *
 */
module.exports = async function (req, res, proceed) {
  if (!sails.config.custom.usePublicWiki) {
    return res.forbidden();
  } //

  return proceed();
};
