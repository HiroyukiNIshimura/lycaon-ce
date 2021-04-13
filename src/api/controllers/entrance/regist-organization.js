module.exports = {
  friendlyName: 'Regist Organization',
  description: 'Regist Organization.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
    },
    name: {
      type: 'string',
      required: true,
      maxLength: 100,
    },
    emailAddress: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 300,
    },
    fullName: {
      type: 'string',
      required: true,
      maxLength: 120,
    },
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
      defaultsTo: 'free',
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
    handleIdAlreadyInUse: {
      statusCode: 409,
      description: 'The provided handleId is already in use.',
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
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

    if (this.req.session.captchaToken != inputs.captchaToken) {
      return { invalidToken: true };
    }
    delete this.req.session.captchaToken;

    var isBackOffice = false;
    if (this.req.organization && this.req.organization.isBackOffice) {
      isBackOffice = true;
    } else {
      if (!sails.config.custom.useRegistOrganization) {
        throw 'notFound';
      }
    }

    var email = inputs.emailAddress.toLowerCase();

    try {
      var conflictingUser = await User.findOne({
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

      var org = await Organization.findOne({
        emailAddress: email,
        deleted: false,
      });
      if (org) {
        throw 'emailAlreadyInUse';
      }

      org = await Organization.findOne({
        handleId: inputs.handleId.toLowerCase(),
        deleted: false,
      });
      if (org) {
        throw 'handleIdAlreadyInUse';
      }

      var token = await sails.helpers.strings.random('url-friendly');

      var org = _.extend({}, inputs);
      var valuesToSet = {
        emailAddress: email,
        password: await sails.helpers.createPassword.with(),
        fullName: inputs.fullName,
        isSuperAdmin: true,
        passwordResetToken: token,
        passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
        representative: true,
      };

      var created = {};
      await sails.getDatastore().transaction(async (db) => {
        created = await Organization.create(org).fetch().usingConnection(db);
        await sails.helpers.createSequence.with({ handleId: created.handleId });

        await Billing.create({ organization: created.id }).fetch().usingConnection(db);

        valuesToSet.organization = created.id;
        var user = await User.create(valuesToSet).fetch().usingConnection(db);

        var maxUploadFileSize = 0;
        if (inputs.plan === 'free') {
          maxUploadFileSize = 10 * 1024 * 1024; //10M
        } else if (plan === 'pine') {
          maxUploadFileSize = 10 * 1024 * 1024; //10M
        } else if (plan === 'bamboo') {
          maxUploadFileSize = 100 * 1024 * 1024; //100M
        } else if (plan === 'plum') {
          maxUploadFileSize = 100 * 1024 * 1024; //100M
        }

        await SysSettings.create({
          organization: created.id,
          internalEmailAddress: email,
          fromEmailAddress: email,
          fromName: inputs.fullName,
          maxUploadFileSize: maxUploadFileSize,
        }).usingConnection(db);

        await Category.create({
          name: '課題',
          displayOrder: 1,
          organization: created.id,
        }).usingConnection(db);

        await Team.createEach([
          {
            name: 'Lycaon',
            description: '最初のチーム',
            users: [user.id],
            emailNoThankYous: [user.id],
            organization: created.id,
          },
        ]).usingConnection(db);
      });

      // 新規組織登録確認メール送信（Backoffice用）
      var backoffice = await Organization.findOne({ handleId: 'brightl' });
      await sails.helpers.sendTemplateEmail.with({
        organization: backoffice,
        to: sails.config.custom.backofficeMailAddress,
        subject: isBackOffice
          ? '新規組織を登録しました'
          : '新規組織がエントランスより登録されました',
        template: 'email-bo-organization',
        templateData: {
          organization: created,
          token: token,
          locale: 'ja',
          isBackOffice: isBackOffice,
        },
      });

      // 新規組織登録確認メール送信
      await sails.helpers.sendTemplateEmail.with({
        organization: created,
        to: email,
        subject: sails.__(
          'Welcome! To Lycaon (Send confirmation URL of organization registration)'
        ),
        template: 'email-regist-organization',
        templateData: {
          organization: created,
          token: token,
          locale: this.req.getLocale(),
        },
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
    //
  },
};
