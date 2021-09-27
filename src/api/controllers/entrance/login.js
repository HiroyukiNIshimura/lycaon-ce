const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = {
  friendlyName: 'Login',

  description: 'Log in using the provided email and password combination.',

  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,

  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true,
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true,
    },

    rememberMe: {
      description: `Whether to extend the lifetime of the user's session.`,
      extendedDescription: `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean',
    },
    honeypot: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 10;
      },
    },
  },

  exits: {
    success: {
      description: 'The requesting user agent has been successfully logged in.',
      extendedDescription: `Under the covers, this stores the id of the logged-in user in the session
as the \`userId\` key.  The next time this user agent sends a request, assuming
it includes a cookie (like a web browser), Sails will automatically make this
user id available as req.session.userId in the corresponding action.  (Also note
that, thanks to the included "custom" hook, when a relevant request is received
from a logged-in user, that user's entire record from the database will be fetched
and exposed as \`req.me\`.)`,
    },

    badCombo: {
      description: `The provided email and password combination does not
      match any user in the database.`,
      responseType: 'unauthorized',
      // ^This uses the custom `unauthorized` response located in `api/responses/unauthorized.js`.
      // To customize the generic "unauthorized" response across this entire app, change that file
      // (see api/responses/unauthorized).
      //
      // To customize the response for _only this_ action, replace `responseType` with
      // something else.  For example, you might set `statusCode: 498` and change the
      // implementation below accordingly (see http://sailsjs.com/docs/concepts/controllers).
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (inputs.honeypot) {
      throw 'notFound';
    }

    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await User.findOne({
      emailAddress: inputs.emailAddress.toLowerCase(),
      deleted: false,
      isNologin: false,
    })
      .populate('teams')
      .populate('organization');

    // If there was no matching user, respond thru the "badCombo" exit.
    if (!userRecord) {
      throw 'badCombo';
    }

    if (!userRecord.organization) {
      throw 'badCombo';
    }

    if (userRecord.organization.deleted) {
      throw 'badCombo';
    }

    try {
      var res = await bcrypt.compare(inputs.password, userRecord.password);
      if (!res) {
        throw 'badCombo';
      }
    } catch (err) {
      sails.log.warn(err);
      throw err;
    }

    // If "Remember Me" was enabled, then keep the session alive for
    // a longer amount of time.  (This causes an updated "Set Cookie"
    // response header to be sent as the result of this request -- thus
    // we must be dealing with a traditional HTTP request in order for
    // this to work.)
    if (inputs.rememberMe) {
      if (this.req.isSocket) {
        sails.log.warn(
          'Received `rememberMe: true` from a virtual request, but it was ignored\n' +
            // eslint-disable-next-line quotes
            "because a browser's session cookie cannot be reset over sockets.\n" +
            'Please use a traditional HTTP request instead.'
        );
      } else {
        this.req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    } //ﬁ

    try {
      var hash = crypto.createHash('sha256').update(`${this.req.ip}|${this.req.headers['user-agent']}`).digest('hex');

      await sails.getDatastore().transaction(async (db) => {
        await ClientHash.destroy({
          user: userRecord.id,
          expiresAt: { '<': Date.now() },
        }).usingConnection(db);

        var clientHashs = await ClientHash.find({ user: userRecord.id }).usingConnection(db);
        if (
          _.findIndex(clientHashs, (o) => {
            return o.hash === hash;
          }) < 0
        ) {
          if (userRecord.lastClientHash && userRecord.lastClientHash !== hash) {
            var lang = userRecord.languagePreference ? userRecord.languagePreference : 'en';
            sails.hooks.i18n.setLocale(lang);
            moment.locale(lang);
            // Send email
            await sails.helpers.mail.sendTemplateEmail.with({
              organization: this.req.organization,
              to: inputs.emailAddress,
              subject: sails.__('Your account was signed in to from a new location'),
              template: 'email-signed-new-location',
              templateData: {
                fullName: userRecord.fullName,
                loginDate: moment().format('lll'),
                ipAddress: this.req.ip,
                userAgent: this.req.headers['user-agent'],
                locale: this.req.me ? this.req.me.languagePreference : this.req.getLocale(),
              },
            });
          }

          await ClientHash.create({
            user: userRecord.id,
            hash: hash,
            expiresAt: Date.now() + sails.config.custom.clientHashDeleteAge,
          }).usingConnection(db);
        }

        await User.updateOne({ id: userRecord.id }).set({ lastClientHash: hash }).usingConnection(db);
      });
    } catch (error) {
      sails.log.error(error);
      throw error;
    }

    // Modify the active session instance.
    // (This will be persisted when the response is sent.)
    this.req.session.userId = userRecord.id;

    // In case there was an existing session (e.g. if we allow users to go to the login page
    // when they're already logged in), broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(this.req);
    }

    var originalUrl = this.req.session.originalUrl;
    delete this.req.session.originalUrl;

    if (originalUrl) {
      return { location: originalUrl };
    }
    return {};
  },
};
