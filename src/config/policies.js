/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': ['is-logged-in', 'localize'],
  'admin/*': ['is-logged-in', 'is-super-admin', 'localize'],
  'backoffice/*': ['is-logged-in', 'is-maintainer', 'localize'],
  'member/*': ['is-logged-in', 'localize'],
  'doc/*': ['use-public-wiki', 'localize'],

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'contact/*': true,
  'delegate/*': true,
  'management/*': ['delegate-authentication-api'],
};
