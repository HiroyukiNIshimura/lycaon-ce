module.exports = {
  friendlyName: 'sendTeamMail',
  description: 'Send Team mail utility.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
      required: true,
    },
    action: {
      type: 'string',
      isIn: ['create', 'update'],
      defaultsTo: 'create',
      description: 'action',
    },
    ignores: {
      type: 'ref',
      description: 'ignore users',
    },
    db: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var team = await Team.findOne({ id: inputs.id })
      .populate('users', { where: { isNologin: false, isSandbox: false, deleted: false } })
      .populate('organization')
      .usingConnection(inputs.db);

    if (team.users.length < 1) {
      return;
    }

    var current = sails.hooks.i18n.getLocale();

    for (let user of team.users) {
      if (_.find(inputs.ignores, { id: user.id })) {
        continue;
      }

      var lang = user.languagePreference ? user.languagePreference : 'en';
      sails.hooks.i18n.setLocale(lang);

      var subject = sails.__('Team {0} has been created and you have joined the members').format(team.name);
      var template = 'email-team-new-member';
      if (inputs.action === 'update') {
        subject = sails.__('You have joined Team {0}').format(team.name);
        template = 'email-team-add-member';
      }

      var data = {
        organization: team.organization,
        template: template,
        subject: subject,
        to: user.emailAddress,
        toName: user.fullName,
        headers: { 'x-lycaon-team-id': team.id },
        templateData: {
          organization: team.organization,
          team: team,
          locale: user.languagePreference,
        },
      };

      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.mailSendTTL,
        job: 'send-email',
        data: data,
      });
    }

    sails.hooks.i18n.setLocale(current);
  },
};
