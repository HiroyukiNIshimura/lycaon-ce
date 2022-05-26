const moment = require('moment');
const momentTZ = require('moment-timezone');

module.exports = {
  friendlyName: 'mail.createVoteAnseweredMail',
  description: 'create vote ansewered mail data.',
  inputs: {
    organization: {
      type: 'ref',
      required: true,
    },
    vote: {
      type: 'ref',
      required: true,
    },
    user: {
      type: 'ref',
      required: true,
    },
    expired: {
      type: 'boolean',
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

      var subject = sails.__('Answers to the questionnaire are available');
      if (inputs.expired) {
        subject = sails.__('Questionnaire response deadline has expired');
      }

      var data = {
        organization: inputs.organization,
        template: 'email-vote-ansewered',
        subject: subject,
        to: inputs.user.emailAddress,
        toName: inputs.user.fullName,
        templateData: {
          organization: inputs.organization,
          vote: inputs.vote,
          title: subject,
          releaseAt: momentTZ(Number(inputs.vote.circulationFrom)).tz('Asia/Tokyo').format('ll') + ' JST',
          endAt: momentTZ(Number(inputs.vote.circulationTo)).tz('Asia/Tokyo').format('ll') + ' JST',
          locale: lang,
        },
      };

      return data;
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
