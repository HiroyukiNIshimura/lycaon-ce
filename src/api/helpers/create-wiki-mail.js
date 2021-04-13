const moment = require('moment');

module.exports = {
  friendlyName: 'create wiki mail data',
  description: 'create wiki mail data.',
  inputs: {
    organization: {
      type: 'ref',
      required: true,
    },
    wiki: {
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

      var subject = sails.__('A new Wiki has been published');
      if (inputs.target === 'update') {
        subject = sails.__('The public wiki has been updated');
      }

      var data = {
        organization: inputs.organization,
        template: 'email-wiki-notify',
        subject: subject,
        to: inputs.user.emailAddress,
        toName: inputs.user.fullName,
        templateData: {
          organization: inputs.organization,
          wiki: inputs.wiki,
          title: subject,
          author: inputs.author,
          releaseAt: moment(Number(inputs.wiki.createdAt)).format('lll') + ' <JST>',
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
