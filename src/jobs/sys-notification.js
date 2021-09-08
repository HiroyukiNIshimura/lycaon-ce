const moment = require('moment');

module.exports = {
  sendMail: async function () {
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var target = dt.valueOf() - sails.config.custom.sysNotificationSendMailTTL;

    var dt2 = new Date();
    dt2.setDate(dt2.getDate() + 1);
    dt2.setHours(0, 0, 0, 0);

    var notifications = await SysNotification.find({
      where: { postingAt: { '<': dt2.valueOf() }, deleted: false },
      sort: [{ postingAt: 'DESC' }, { id: 'DESC' }],
      limit: 5,
    });

    if (notifications.length < 1) {
      sails.log.info('システムからのお知らせが見つからないため処理を終了します。');
      return 'skip';
    }

    var list = await User.find({
      lastSeenAt: { '<': target },
      isNologin: false,
      deleted: false,
    }).populate('organization');

    for (let user of list) {
      var qty = await sails.models['sysnotification_users__user_sysnotifications'].count({
        // eslint-disable-next-line camelcase
        user_sysNotifications: user.id,
      });
      if (qty < 1) {
        continue;
      }

      var lang = user.languagePreference ? user.languagePreference : 'en';
      sails.hooks.i18n.setLocale(lang);
      moment.locale(lang);

      for (let item of notifications) {
        item.displayDate = moment(Number(item.postingAt)).format('ll') + ' JST';
      }

      var data = {
        organization: user.organization,
        template: 'email-sys-notification',
        subject: sails.__('Notice from the system'),
        to: user.emailAddress,
        toName: user.fullName,
        templateData: {
          organization: user.organization,
          notifications: notifications,
          locale: lang,
        },
      };
      await sails.helpers.mail.sendTemplateEmail.with(data);
    }
  },
};
