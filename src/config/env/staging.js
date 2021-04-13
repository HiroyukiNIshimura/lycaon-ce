/**
 * Staging environment settings
 * (sails.config.*)
 *
 * This is mostly a carbon copy of the production environment settings
 * in config/env/production.js, but with the overrides listed below.
 * For more detailed information and links about what these settings do
 * see the production config file.
 *
 * > This file takes effect when `sails.config.environment` is "staging".
 * > But note that NODE_ENV should still be "production" when lifting
 * > your app in the staging environment.  In other words:
 * > ```
 * >     NODE_ENV=production sails_environment=staging node app
 * > ```
 *
 * If you're unsure or want advice, stop by:
 * https://sailsjs.com/support
 */

var PRODUCTION_CONFIG = require('./production');
//--------------------------------------------------------------------------
// /\  Start with your production config, even if it's just a guess for now,
// ||  then configure your staging environment afterwards.
//     (That way, all you need to do in this file is set overrides.)
//--------------------------------------------------------------------------

module.exports = Object.assign({}, PRODUCTION_CONFIG, {
  datastores: Object.assign({}, PRODUCTION_CONFIG.datastores, {
    default: Object.assign({}, PRODUCTION_CONFIG.datastores.default, {
      // url: 'mysql://shared:some_password_everyone_knows@db.example.com:3306/my_staging_db',
      //--------------------------------------------------------------------------
      // /\  Hard-code your staging db `url`.
      // ||  (or use system env var: `sails_datastores__default__url`)
      //--------------------------------------------------------------------------
    }),
  }),

  sockets: Object.assign({}, PRODUCTION_CONFIG.sockets, {
    //--------------------------------------------------------------------------
    // /\  Hard-code a staging-only override for allowed origins.
    // ||  (or set this array via JSON-encoded system env var)
    //     ```
    //     sails_sockets__onlyAllowOrigins='["http://localhost:1337", "…"]'
    //     ```
    //--------------------------------------------------------------------------
    // url: 'redis://shared:some_password_everyone_knows@bigsquid.redistogo.com:9562/',
    //--------------------------------------------------------------------------
    // /\  Hard-code your staging Redis server's `url`.
    // ||  (or use system env var: `sails_sockets__url`)
    //--------------------------------------------------------------------------
  }),

  session: Object.assign({}, PRODUCTION_CONFIG.session, {
    // url: 'redis://shared:some_password_everyone_knows@bigsquid.redistogo.com:9562/staging-sessions',
    //--------------------------------------------------------------------------
    // /\  Hard-code your staging Redis server's `url` again here.
    // ||  (or use system env var: `sails_session__url`)
    //--------------------------------------------------------------------------
  }),

  /**************************************************************************
   *                                                                         *
   * Set the staging log level.                                           *
   *                                                                         *
   * (https://sailsjs.com/config/log)                                        *
   *                                                                         *
   ***************************************************************************/
  log: {
    level: 'debug',
  },

  models: Object.assign({}, PRODUCTION_CONFIG.models, {
    migrate: 'safe',
  }),
  custom: Object.assign({}, PRODUCTION_CONFIG.custom, {}),
});
