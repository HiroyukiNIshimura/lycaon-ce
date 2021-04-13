const moment = require('moment');

module.exports = {
  friendlyName: 'request unsubscribed',

  description: 'request unsubscribed.',

  inputs: {},

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
    requestAlready: {
      statusCode: 409,
      description: 'already in use.',
    },
  },

  fn: async function () {
    var current = await Billing.findOne({ organization: this.req.organization.id }).populate(
      'organization'
    );
    if (!current) {
      throw 'notFound';
    }
    if (current.unsubscribedAt) {
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
        await Billing.updateOne({ id: current.id }).set({ unsubscribedAt: dt }).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var backoffice = await Organization.findOne({ handleId: 'brightl' });
    const settings = await SysSettings.findOne({ organization: backoffice.id });

    // バックオフィスあて
    sails.hooks.i18n.setLocale('ja');
    moment.locale('ja');
    await sails.helpers.sendTemplateEmail.with({
      organization: backoffice,
      to: sails.config.custom.backofficeMailAddress,
      subject: '退会依頼通知',
      template: 'email-bo-unsubscribed',
      templateData: {
        billing: current,
        locale: 'ja',
      },
    });

    sails.hooks.i18n.setLocale(representative.languagePreference);
    moment.locale(representative.languagePreference);
    await sails.helpers.sendTemplateEmail.with({
      organization: backoffice,
      to: representative.emailAddress,
      subject: sails.__('The request for unsubscribed has been accepted'),
      template: 'email-unsubscribed',
      templateData: {
        billing: current,
        unsubscribedDate: moment(dt).format('llll'),
        locale: representative.languagePreference,
      },
    });

    this.req.session.unsubscribed = true;

    return {};
  },
};
