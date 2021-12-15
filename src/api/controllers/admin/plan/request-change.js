const moment = require('moment');

module.exports = {
  friendlyName: 'request change',

  description: 'request change.',

  inputs: {
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
    },
    preferredDate: {
      type: 'number',
      required: true,
    },
    reasons: {
      type: 'json',
    },
    grade: {
      type: 'string',
      isIn: ['upgrade', 'downgrade'],
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
    requestAlready: {
      statusCode: 409,
      description: 'already in process.',
    },
  },

  fn: async function (inputs) {
    var current = await Billing.findOne({ organization: this.req.organization.id }).populate('organization');
    if (!current) {
      throw 'notFound';
    }
    if (current.planChangeAt) {
      throw 'requestAlready';
    }

    var representative = await User.findOne({
      where: { representative: true, organization: current.organization.id },
    });
    if (!representative) {
      throw 'notFound';
    }

    var dt = Date.now();

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Billing.updateOne({ id: current.id }).set({ planChangeAt: dt }).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var backoffice = await Organization.findOne({ handleId: 'brightl' });
    var grade = inputs.grade === 'upgrade' ? 'Upgrade' : 'Downgrade';

    var getReasons = function (reasons, lang) {
      if (!reasons) {
        return '';
      }

      sails.hooks.i18n.setLocale(lang);
      moment.locale(lang);

      var data = [
        sails.__('I want to reduce the number of accounts because the number of users has decreased'),
        sails.__(`I'm not using the file capacity more than I expected`),
        sails.__('Because I rarely use the functions of the paid plan'),
        sails.__('Other'),
      ];

      var messages = [];
      for (let entry of reasons) {
        messages.push(data[Number(entry)]);
      }

      return messages.join(', ');
    };

    // バックオフィスあて
    sails.hooks.i18n.setLocale('ja');
    moment.locale('ja');
    await sails.helpers.mail.sendTemplateEmail.with({
      organization: backoffice,
      to: sails.config.custom.backofficeMailAddress,
      subject: 'プラン変更依頼通知',
      template: 'email-bo-plan-change',
      templateData: {
        newPlan: inputs.plan,
        preferredDate: moment(inputs.preferredDate).format('llll'),
        grade: grade,
        reasons: getReasons(inputs.reasons, 'ja'),
        billing: current,
        locale: 'ja',
      },
    });

    sails.hooks.i18n.setLocale(representative.languagePreference);
    moment.locale(representative.languagePreference);
    await sails.helpers.mail.sendTemplateEmail.with({
      organization: backoffice,
      to: representative.emailAddress,
      subject: sails.__('We accepted the plan change'),
      template: 'email-plan-change',
      templateData: {
        newPlan: inputs.plan,
        preferredDate: moment(inputs.preferredDate).format('llll'),
        grade: grade,
        reasons: getReasons(inputs.reasons, representative.languagePreference),
        billing: current,
        planChangeDate: moment(dt).format('llll'),
        locale: representative.languagePreference,
      },
    });

    this.req.session.planChange = true;

    return {};
  },
};
