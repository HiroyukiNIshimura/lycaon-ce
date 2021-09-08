module.exports = {
  friendlyName: 'Create user',

  description: 'Create user api.',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    isSuperAdmin: {
      type: 'boolean',
    },
    selectedTeams: {
      type: 'ref',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    unSelectedTeams: {
      statusCode: 405,
      description: 'The provided not selected teams.',
    },
    unplanned: {
      statusCode: 405,
      description: 'Out of range of plan.',
    },
  },

  fn: async function (inputs) {
    if (!(await sails.helpers.planing.planingUser.with({ organization: this.req.organization.id }))) {
      throw 'unplanned';
    }

    if (inputs.selectedTeams.length < 1) {
      throw 'unSelectedTeams';
    }

    var email = inputs.email.toLowerCase();
    let conflictingUser = await User.findOne({
      or: [
        {
          emailAddress: email,
        },
        {
          emailChangeCandidate: email,
        },
      ],
    });
    if (conflictingUser) {
      throw 'emailAlreadyInUse';
    }

    var token = await sails.helpers.strings.random('url-friendly');

    var created = {};
    var valuesToSet = {
      emailAddress: email,
      password: await sails.helpers.createPassword.with(),
      fullName: inputs.name,
      isSuperAdmin: inputs.isSuperAdmin,
      deleted: inputs.deleted,
      passwordResetToken: token,
      passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
      teams: inputs.selectedTeams.map((o) => o.id),
      organization: this.req.organization.id,
    };

    try {
      await sails.getDatastore().transaction(async (db) => {
        created = await User.create(valuesToSet).fetch().usingConnection(db);
      });

      // 新規ユーザー登録確認メール送信
      await sails.helpers.mail.sendTemplateEmail.with({
        organization: this.req.organization,
        to: email,
        subject: sails.__('Welcome! To Lycaon (Send user registration confirmation URL)'),
        template: 'email-new-user-reset-password',
        templateData: {
          fullName: created.fullName,
          token: token,
          locale: this.req.me.languagePreference,
        },
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('You have created a user {0}').format(valuesToSet.fullName);

    return {
      id: created.id,
      name: created.fullName,
    };
  },
};
