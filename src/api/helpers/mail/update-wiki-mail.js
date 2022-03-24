const moment = require('moment');
const momentTZ = require('moment-timezone');

module.exports = {
  friendlyName: 'mail.updateWikiMail',
  description: 'update wiki mail data.',
  inputs: {
    organization: {
      type: 'ref',
      required: true,
    },
    wiki: {
      type: 'ref',
      required: true,
    },
    changer: {
      type: 'ref',
      required: true,
    },
    user: {
      type: 'ref',
      required: true,
    },
    team: {
      type: 'ref',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      var lang = inputs.user.languagePreference ? inputs.user.languagePreference : 'en';
      sails.hooks.i18n.setLocale(lang);
      moment.locale(lang);

      var subject = sails.__('The public wiki has been updated');

      var data = {
        organization: inputs.organization,
        template: 'email-wiki-update-notify',
        subject: subject,
        to: inputs.user.emailAddress,
        toName: inputs.user.fullName,
        templateData: {
          organization: inputs.organization,
          wiki: inputs.wiki,
          title: subject,
          changer: inputs.changer,
          updateAt: momentTZ(Number(inputs.wiki.updatedAt)).tz('Asia/Tokyo').format('lll') + ' JST',
          locale: lang,
          team: inputs.team,
        },
      };

      return data;
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
