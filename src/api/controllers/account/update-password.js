module.exports = {
  friendlyName: 'Update password',

  description: 'Update the password for the logged-in user.',

  inputs: {
    password: {
      description: 'The new, unencrypted password.',
      example: 'abc123v2',
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
    if (this.req.me.isNologin) {
      throw 'notFound';
    }

    // Hash the new password.
    var bcrypt = require('bcrypt');
    var hashed = await bcrypt.hash(inputs.password, 10);

    // Update the record for the logged-in user.
    var updated = await User.updateOne({
      id: this.req.me.id,
    }).set({
      password: hashed,
    });

    // パスワード変更確認メール送信
    await sails.helpers.mail.sendTemplateEmail.with({
      organization: this.req.organization,
      to: updated.emailAddress,
      subject: sails.__('Notification of password change completion'),
      template: 'email-changed-password',
      templateData: {
        fullName: updated.fullName,
        locale: this.req.me.languagePreference,
      },
    });
  },
};
