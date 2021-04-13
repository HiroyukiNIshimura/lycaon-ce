/**
 * localize
 *
 */
module.exports = async function (req, res, proceed) {
  if (req.me) {
    //ローケルセット
    var lang = req.me.languagePreference ? req.me.languagePreference : 'en';
    sails.hooks.i18n.setLocale(lang);
    req.setLocale(lang);
  }
  return proceed();
};
