module.exports = {
  friendlyName: 'Send password recovery email',

  description:
    'Send a password recovery notification to the user with the specified email address.',

  inputs: {
    emailAddress: {
      description: 'The email address of the alleged user who wants to recover their password.',
      example: 'rydahl@example.com',
      type: 'string',
      required: true,
    },
    captchaToken: {
      type: 'string',
      maxLength: 5,
    },
    honeypot: {
      type: 'string',
      maxLength: 10,
    },
  },

  exits: {
    success: {
      description:
        'The email address might have matched a user in the database.  (If so, a recovery email was sent.)',
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

    if (!this.req.session.captchaToken) {
      return { invalidToken: true };
    }

    if (this.req.session.captchaToken !== inputs.captchaToken) {
      return { invalidToken: true };
    }

    delete this.req.session.captchaToken;

    // Find the record for this user.
    // (Even if no such user exists, pretend it worked to discourage sniffing.)
    var userRecord = await User.findOne({ emailAddress: inputs.emailAddress });
    if (!userRecord) {
      sails.log.warn(
        `存在しないアカウントのメールアドレスが使用されました。${inputs.emailAddress}`
      );
      return;
    } //•

    // Come up with a pseudorandom, probabilistically-unique token for use
    // in our password recovery email.
    var token = await sails.helpers.strings.random('url-friendly');

    // Store the token on the user record
    // (This allows us to look up the user when the link from the email is clicked.)
    await User.updateOne({ id: userRecord.id }).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
    });

    // Send recovery email
    await sails.helpers.sendTemplateEmail.with({
      organization: this.req.organization,
      to: inputs.emailAddress,
      subject: sails.__('Password reset notification'),
      template: 'email-reset-password',
      templateData: {
        fullName: userRecord.fullName,
        token: token,
        locale: this.req.me ? this.req.me.languagePreference : this.req.getLocale(),
      },
    });
  },
};
