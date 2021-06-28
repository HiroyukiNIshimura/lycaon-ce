module.exports = {
  friendlyName: 'Reset password user',

  description: 'Reset password user api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await User.findOne({ id: inputs.id, organization: this.req.organization.id });
    if (!current) {
      throw 'notFound';
    }

    if (current.isNologin) {
      throw 'notFound';
    }

    var token = await sails.helpers.strings.random('url-friendly');

    try {
      var valuesToSet = {
        password: await sails.helpers.createPassword.with(),
        passwordResetToken: token,
        passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
      };

      await sails.getDatastore().transaction(async (db) => {
        await User.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);
      });

      // 新規ユーザー登録確認メール送信
      await sails.helpers.sendTemplateEmail.with({
        organization: this.req.organization,
        to: current.emailAddress,
        subject: sails.__('Welcome! To Lycaon (Send user registration confirmation URL)'),
        template: 'email-new-user-reset-password',
        templateData: {
          fullName: current.fullName,
          token: token,
          locale: this.req.me.languagePreference,
        },
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return { id: current.id, fullName: current.fullName };
  },
};
