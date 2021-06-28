module.exports = {
  friendlyName: 'Create wiki',

  description: 'Create "Wiki" page.',
  inputs: {
    team: {
      type: 'number',
    },
    subject: {
      type: 'string',
      required: true,
      maxLength: 200,
    },
    body: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 107374180;
      },
      example: 'これはMarkdownのままのデータ',
    },
    concept: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '0:非公開、1:外部に公開',
    },
    tags: {
      type: 'ref',
    },
  },

  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a wiki that has not joined.',
    },
    unauthorized: {
      statusCode: 405,
      description: 'The provided name is already in use.',
    },
  },

  fn: async function (inputs) {
    if (!this.req.me.isSuperAdmin && inputs.concept === 1) {
      throw 'unauthorized';
    }

    var team = { id: undefined };

    if (inputs.concept === 0) {
      team = await sails.helpers.validateMembership.with({
        id: inputs.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }
    }

    var wiki = {
      handleId: this.req.organization.handleId,
      subject: inputs.subject,
      body: inputs.body,
      team: team.id,
      concept: inputs.concept,
      owner: this.req.me.id,
      tags: [],
      accessCount: 0,
    };

    var created = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        for (let entry of inputs.tags) {
          var tags = await Tag.find()
            .where({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
            .usingConnection(db);

          if (tags.length < 1) {
            let tag = await Tag.create({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
              .fetch()
              .usingConnection(db);

            wiki.tags.push(tag.id);
          } else {
            wiki.tags.push(tags[0].id);
          }
        }

        wiki.tagToken = '';
        _.each(wiki.tags, (tag) => {
          wiki.tagToken += tag + ':';
        });

        wiki.no = await sails.helpers.getNextval.with({
          target: 'wiki',
          handleId: wiki.handleId,
        });

        created = await Wiki.create(wiki).fetch().usingConnection(db);

        if (inputs.concept === 0) {
          team = await Team.findOne({ id: created.team }).populate('users');
          for (let entry of team.users) {
            var data = await sails.helpers.createWikiMail.with({
              organization: this.req.me.organization,
              wiki: created,
              author: this.req.me,
              target: 'create',
              user: entry,
            });

            await sails.helpers.agendaSchedule.with({
              ttl: Date.now() + sails.config.custom.mailSendTTL,
              job: 'send-email',
              data: data,
            });
          }
        }
      });

      //メール配信データ作成時にsails.hooks.i18n.localeが変更されているので
      sails.hooks.i18n.setLocale(this.req.me.languagePreference);
      this.req.session.effectMessage = sails.__('Created a Wiki');
      return {
        id: created.id,
        no: created.no,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
