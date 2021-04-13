const moment = require('moment');
module.exports = {
  recommendation: async function () {
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var expier = dt.valueOf() - sails.config.custom.freePlanNotAccessTTL;

    var NATIVE_ACTIVITY_SQL = `
SELECT "organization", MAX("lastSeenAt") as "lastSeenAt"
  FROM "user"
 GROUP BY "organization"
`;

    var targets = [];

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_ACTIVITY_SQL, []);
      for (let entry of rawResult.rows) {
        var organization = await Organization.findOne({ id: entry.organization, deleted: false });
        if (!organization) {
          continue;
        }

        if (entry.lastSeenAt == 0) {
          if (organization.createdAt < expier) {
            targets.push(organization);
          }
        } else if (entry.lastSeenAt < expier) {
          targets.push(organization);
        }
      }
      if (targets.length < 1) {
        return 'skip';
      }
      //
      for (let organization of targets) {
        //
        var representative = await User.findOne({
          where: { representative: true, organization: organization.id },
        });
        if (!representative) {
          continue;
        }

        sails.hooks.i18n.setLocale(representative.languagePreference);
        moment.locale(representative.languagePreference);

        var data = {
          organization: organization,
          to: representative.emailAddress,
          toName: representative.fullName,
          subject: sails.__("It seems that you haven't used Lycaon for a while ..."),
          template: 'email-freeplan-recommendation',
          templateData: {
            organization: organization,
            expireDays: sails.config.custom.freePlanNotAccessTTL / (24 * 60 * 60 * 1000),
            locale: representative.languagePreference,
          },
        };
        await sails.helpers.sendTemplateEmail.with(data);

        sails.log.info(
          `${organization.handleId} ${organization.name} 宛に退会勧告メールを送信しました。`
        );
      }
    } catch (err) {
      sails.log.error(err);
    }
  },
};
