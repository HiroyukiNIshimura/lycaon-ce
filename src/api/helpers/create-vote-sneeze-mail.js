const moment = require('moment');

module.exports = {
  friendlyName: 'create vote sneeze mail data',
  description: 'create vote sneeze mail data.',
  inputs: {
    organization: {
      type: 'ref',
      required: true,
    },
    vote: {
      type: 'ref',
      required: true,
    },
    sneeze: {
      type: 'ref',
      required: true,
    },
    target: {
      type: 'string',
      isIn: ['create', 'update'],
      defaultsTo: 'create',
    },
    hashTag: {
      type: 'string',
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

      var subject = sails.__('A comment has arrived in the circulation');
      if (inputs.target === 'update') {
        subject = sails.__('Circulation comments have been updated');
      }

      var data = {
        organization: inputs.organization,
        template: 'email-vote-sneeze-notify',
        subject: subject,
        to: inputs.user.emailAddress,
        toName: inputs.user.fullName,
        templateData: {
          organization: inputs.organization,
          vote: inputs.vote,
          title: subject,
          author: inputs.vote.author,
          releaseAt: moment(Number(inputs.vote.circulationFrom)).format('ll') + ' <JST>',
          endAt: moment(Number(inputs.vote.circulationTo)).format('ll') + ' <JST>',

          commentBody: await sails.helpers.mdToHtml.with({
            markdown: inputs.sneeze.comment,
          }),
          safeCommentBody: await sails.helpers.mdToSanitize.with({
            markdown: inputs.sneeze.comment,
          }),
          commentAt: moment(Number(inputs.sneeze.updatedAt)).format('llll') + ' <JST>',
          commenter: inputs.sneeze.owner,
          hashTag: inputs.hashTag,
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
