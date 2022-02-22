/**
 * @description :: The conventional "custom" hook.  Extends this app with custom server-start-time and request-time logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */
module.exports = function defineCustomHook(sails) {
  return {
    /**
     * Runs when a Sails app loads/lifts.
     */
    initialize: async function () {
      sails.log.info('Initializing project hook... (`api/hooks/custom/`)');

      sails.after('hook:grunt:loaded', async () => {
        //
        sails.log.info('hook:grunt:loaded... (`api/hooks/custom/`)');
      }); //_∏_

      // http://uhndev.github.io/2015/08/04/using-database-views-with-sailsjs/
      sails.after('hook:blueprints:loaded', async () => {
        //
        sails.log.info('hook:blueprints:loaded... (`api/hooks/custom/`)');
      }); //_∏_
      sails.after('hook:orm:loaded', async () => {
        //
        sails.log.info('hook:orm:loaded... (`api/hooks/custom/`)');
      }); //_∏_

      // After "sails-hook-organics" finishes initializing, configure Stripe
      // and Sendgrid packs with any available credentials.
      sails.after('hook:organics:loaded', async () => {
        //
        sails.log.info('hook:organics:loaded... (`api/hooks/custom/`)');
      }); //_∏_

      // ... Any other app-specific setup code that needs to run on lift,
      // even in production, goes here ...

      Object.defineProperty(String.prototype, 'format', {
        value: function format() {
          var args = arguments;
          return this.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== undefined ? args[number] : match;
          });
        },
        writable: true,
        configurable: true,
      });

      process.on('exit', () => {
        sails.log.info('Got exit. ');
      });
      process.on('SIGHUP', () => {
        sails.log.info('Got SIGHUP. ');
      });
      process.on('SIGINT', () => {
        sails.log.info('Got SIGINT. ');
      });
      process.on('SIGTERM', () => {
        sails.log.info('Got SIGTERM. ');
      });
    },

    routes: {
      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        '/*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            var url = require('url');

            // First, if this is a GET request (and thus potentially a view),
            // attach a couple of guaranteed locals.
            if (req.method === 'GET') {
              // The  `_environment` local lets us do a little workaround to make Vue.js
              // run in "production mode" without unnecessarily involving complexities
              // with webpack et al.)
              if (res.locals._environment !== undefined) {
                throw new Error(
                  'Cannot attach Sails environment as the view local `_environment`, because this view local already exists!  (Is it being attached somewhere else?)'
                );
              }
              res.locals._environment = sails.config.environment;

              // The `me` local is set explicitly to `undefined` here just to avoid having to
              // do `typeof me !== 'undefined'` checks in our views/layouts/partials.
              // > Note that, depending on the request, this may or may not be set to the
              // > logged-in user record further below.
              if (res.locals.me !== undefined) {
                throw new Error(
                  'Cannot attach view local `me`, because this view local already exists!  (Is it being attached somewhere else?)'
                );
              }
              res.locals.me = undefined;
            } //ﬁ

            // Next, if we're running in our actual "production" or "staging" Sails
            // environment, check if this is a GET request via some other host,
            // for example a subdomain like `webhooks.` or `click.`.  If so, we'll
            // automatically go ahead and redirect to the corresponding path under
            // our base URL, which is environment-specific.
            // > Note that we DO NOT redirect virtual socket requests and we DO NOT
            // > redirect non-GET requests (because it can confuse some 3rd party
            // > platforms that send webhook requests.)  We also DO NOT redirect
            // > requests in other environments to allow for flexibility during
            // > development (e.g. so you can preview an app running locally on
            // > your laptop using a local IP address or a tool like ngrok, in
            // > case you want to run it on a real, physical mobile/IoT device)
            var configuredBaseHostname;
            try {
              configuredBaseHostname = url.parse(sails.config.custom.baseUrl).host;
            } catch (unusedErr) {
              /*…*/
            }

            //ログインしているか？の時点ではブラウザのローケル
            res.locals.language = req.getLocale();
            res.locals.i18nlocales = sails.config.i18n.locales;

            if (
              (sails.config.environment === 'staging' || sails.config.environment === 'production') &&
              !req.isSocket &&
              req.method === 'GET' &&
              req.hostname !== configuredBaseHostname
            ) {
              sails.log.info(
                'Redirecting GET request from `' +
                  req.hostname +
                  '` to configured expected host (`' +
                  configuredBaseHostname +
                  '`)...'
              );
              return res.redirect(sails.config.custom.baseUrl + req.url);
            } //•

            // No session? Proceed as usual.
            // (e.g. request for a static asset)
            if (!req.session) {
              return next();
            }

            // Not logged in? Proceed as usual.
            if (!req.session.userId) {
              return next();
            }

            // Otherwise, look up the logged-in user.
            var loggedInUser = await sails.helpers.compact(
              await User.findOne({
                id: req.session.userId,
              })
                .populate('organization')
                .populate('teams')
            );
            // If the logged-in user has gone missing, log a warning,
            // wipe the user id from the requesting user agent's session,
            // and then send the "unauthorized" response.
            if (!loggedInUser) {
              sails.log.warn(
                'Somehow, the user record for the logged-in user (`' + req.session.userId + '`) has gone missing....'
              );
              delete req.session.userId;
              return res.unauthorized();
            }

            var sysSettings = await SysSettings.findOne({
              organization: loggedInUser.organization.id,
            });

            // Add additional information for convenience when building top-level navigation.
            // (i.e. whether to display "Dashboard", "My Account", etc.)
            if (!loggedInUser.password || loggedInUser.emailStatus === 'unconfirmed') {
              loggedInUser.dontDisplayAccountLinkInNav = true;
            }

            // Expose the user record as an extra property on the request object (`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if (req.me !== undefined) {
              throw new Error(
                'Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)'
              );
            }

            var NATIVE_SQL = `
SELECT count(t.*) as qty
  FROM "sysnotification_users__user_sysNotifications" t
 WHERE t."user_sysNotifications" = $1
   AND exists (SELECT 1 FROM "sys_notification"
       WHERE "id" = t."sysnotification_users"
         AND "deleted" = false
         AND "postingAt" < $2);
            `;

            var dt = new Date();
            dt.setDate(dt.getDate() + 1);
            dt.setHours(0, 0, 0, 0);

            let rawResult = await sails.sendNativeQuery(NATIVE_SQL, [loggedInUser.id, dt.valueOf()]);

            if (rawResult.rows[0].qty > 0) {
              loggedInUser.hasNewSystemNotifications = true;
            }

            // setup for request
            req.me = loggedInUser;
            req.organization = loggedInUser.organization;
            req.sysSettings = sysSettings;

            // If our "lastSeenAt" attribute for this user is at least a few seconds old, then set it
            // to the current timestamp.
            //
            // (Note: As an optimization, this is run behind the scenes to avoid adding needless latency.)
            var MS_TO_BUFFER = 60 * 1000;
            var now = Date.now();
            if (loggedInUser.lastSeenAt < now - MS_TO_BUFFER) {
              //ここは敢えて非同期
              User.updateOne({ id: loggedInUser.id })
                .set({ lastSeenAt: now })
                .exec((err) => {
                  if (err) {
                    sails.log.error(
                      'Background task failed: Could not update user (`' +
                        loggedInUser.id +
                        '`) with a new `lastSeenAt` timestamp.  Error details: ' +
                        err.stack
                    );
                    return;
                  } //•
                  sails.log.verbose('Updated the `lastSeenAt` timestamp for user `' + loggedInUser.id + '`.');
                  // Nothing else to do here.
                }); //_∏_  (Meanwhile...)
            } //ﬁ

            // If this is a GET request, then also expose an extra view local (`<%= me %>`).
            // > Note that we make sure a local named `me` doesn't already exist first.
            // > Also note that we strip off any properties that correspond with protected attributes.
            if (req.method === 'GET') {
              if (res.locals.me !== undefined) {
                throw new Error(
                  'Cannot attach logged-in user as the view local `me`, because this view local already exists!  (Is it being attached somewhere else?)'
                );
              }

              // Exclude any fields corresponding with attributes that have `protect: true`.
              var sanitizedUser = _.extend({}, loggedInUser);
              for (let attrName in User.attributes) {
                if (User.attributes[attrName].protect) {
                  delete sanitizedUser[attrName];
                }
              } //∞

              // If there is still a "password" in sanitized user data, then delete it just to be safe.
              // (But also log a warning so this isn't hopelessly confusing.)
              if (sanitizedUser.password) {
                sails.log.warn(
                  'The logged in user record has a `password` property, but it was still there after pruning off all properties that match `protect: true` attributes in the User model.  So, just to be safe, removing the `password` property anyway...'
                );
                delete sanitizedUser.password;
              } //ﬁ

              if (!sanitizedUser.languagePreference) {
                sanitizedUser.languagePreference = 'en';
              }

              // setup for response
              res.locals.i18nlocales = sails.config.i18n.locales;
              res.locals.language = sanitizedUser.languagePreference; //ログイン状態ならユーザーの設定したローケル
              res.locals.me = sanitizedUser;
              res.locals.organization = loggedInUser.organization;
              res.locals.isTeamPage = false;
              res.locals.sysSettings = sysSettings;
              res.locals.planlimitation = sails.config.custom.plans[loggedInUser.organization.plan];
              res.locals.isDemosite = sails.config.custom.isDemosite;
            } //ﬁ

            return next();
          },
        },
      },
    },
  };
};
