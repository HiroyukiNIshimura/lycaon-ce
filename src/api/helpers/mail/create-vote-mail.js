const moment = require('moment');

module.exports = {
  friendlyName: 'mail.createVoteMail',
  description: 'create vote mail data.',
  inputs: {
    organization: {
      type: 'ref',
      required: true,
    },
    vote: {
      type: 'ref',
      required: true,
    },
    author: {
      type: 'ref',
      required: true,
    },
    target: {
      type: 'string',
      isIn: ['create', 'update'],
      defaultsTo: 'create',
    },
    user: {
      type: 'ref',
      required: true,
    },
    unread: {
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

      var subject = sails.__('A new circulation has been published');
      if (inputs.target === 'update') {
        subject = sails.__('The public circulation has been updated');
      }

      if (inputs.unread) {
        subject = sails.__('There is an unread circulation in the end of publication');
      }

      var data = {
        organization: inputs.organization,
        template: 'email-vote-notify',
        subject: subject,
        to: inputs.user.emailAddress,
        toName: inputs.user.fullName,
        templateData: {
          organization: inputs.organization,
          vote: inputs.vote,
          title: subject,
          author: inputs.author,
          releaseAt: moment(Number(inputs.vote.circulationFrom)).format('ll') + ' JST',
          endAt: moment(Number(inputs.vote.circulationTo)).format('ll') + ' JST',
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
