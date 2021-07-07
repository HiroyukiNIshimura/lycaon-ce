module.exports = {
  friendlyName: 'update vote',

  description: 'update vote.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
    },
    subject: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    body: {
      type: 'string',
      example: 'これはMarkdownのままのデータ',
    },
    isQuestionnaireFormat: {
      type: 'boolean',
      description: 'アンケート形式かどうか',
    },
    question: {
      type: 'string',
      description: '設問',
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    circulationFrom: {
      type: 'ref',
      columnType: 'bigint',
      required: true,
      description: '回覧期間FROM',
    },
    circulationTo: {
      type: 'ref',
      columnType: 'bigint',
      required: true,
      description: '回覧期間To',
    },
    users: {
      type: 'ref',
    },
    multipleAnswers: {
      type: 'boolean',
      description: '回答が複数選択可能かどうか',
    },
    choices: {
      type: 'ref',
    },
    hasOther: {
      type: 'boolean',
      description: '選択肢に「その他」を追加するか',
    },
    forceUpdate: {
      type: 'boolean',
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a vote that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Vote.findOne({ id: inputs.id }).populate('choices').populate('answers');
    if (!current) {
      throw 'notFound';
    }

    if (current.organization !== this.req.me.organization.id) {
      throw 'notFound';
    }

    var valuesToSet = {
      subject: inputs.subject,
      body: inputs.body,
      isQuestionnaireFormat: inputs.isQuestionnaireFormat,
      question: inputs.question,
      circulationFrom: inputs.circulationFrom,
      circulationTo: inputs.circulationTo,
      multipleAnswers: inputs.multipleAnswers,
      hasOther: inputs.hasOther,
      mailSended: false,
    };

    if (inputs.users) {
      valuesToSet.users = inputs.users.map((o) => o.id);
    }

    var isDeleteAnswers = false;
    if (inputs.forceUpdate) {
      isDeleteAnswers = true;
    } else {
      if (inputs.isQuestionnaireFormat) {
        if (inputs.question !== current.question) {
          isDeleteAnswers = true;
        }
        if (inputs.multipleAnswers !== current.multipleAnswers) {
          isDeleteAnswers = true;
        }
        if (inputs.hasOther !== current.hasOther) {
          isDeleteAnswers = true;
        }

        var clouds = _.filter(current.choices, { isOther: false });
        if (inputs.choices.length !== clouds.length) {
          isDeleteAnswers = true;
        } else {
          for (let entry of clouds) {
            let index = _.findIndex(inputs.choices, (o) => {
              return o.id === entry.id;
            });
            if (index < 0) {
              isDeleteAnswers = true;
              break;
            }
          }
        }
      } else {
        if (current.isQuestionnaireFormat) {
          isDeleteAnswers = true;
        }
      }

      if (isDeleteAnswers) {
        return { isDeleteAnswers: true };
      }
    }

    var updated = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        if (isDeleteAnswers) {
          await VoteAnswer.destroy({ vote: current.id }).usingConnection(db);
        }

        await VoteChoices.destroy({ vote: current.id }).usingConnection(db);
        updated = await Vote.updateOne({ id: current.id }).set(valuesToSet).usingConnection(db);

        if (inputs.isQuestionnaireFormat) {
          var choicesToSets = [];
          for (let entry of inputs.choices) {
            choicesToSets.push({
              choices: entry.value,
              isOther: false,
              vote: updated.id,
            });
          }
          if (updated.hasOther) {
            choicesToSets.push({
              choices: sails.__('Other'),
              isOther: true,
              vote: updated.id,
            });
          }

          await VoteChoices.createEach(choicesToSets).usingConnection(db);
        } else {
          await VoteChoices.create({
            choices: 'Browsed',
            isOther: false,
            vote: updated.id,
          }).usingConnection(db);
        }
      });

      if (updated.circulationFrom <= Date.now()) {
        var formail = await Vote.findOne({ id: updated.id }).populate('users').populate('author');
        for (let entry of formail.users) {
          var data = await sails.helpers.createVoteMail.with({
            organization: this.req.me.organization,
            vote: formail,
            author: formail.author,
            target: 'update',
            user: entry,
          });

          await sails.helpers.agendaSchedule.with({
            ttl: Date.now() + sails.config.custom.mailSendTTL,
            job: 'send-email',
            data: data,
          });
        }

        await Vote.updateOne({ id: formail.id }).set({ mailSended: true });
      }

      //メール配信データ作成時にsails.hooks.i18n.localeが変更されているので
      sails.hooks.i18n.setLocale(this.req.me.languagePreference);
      this.req.session.effectMessage = sails.__('The circulate notice has been updated');
      return {
        id: updated.id,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
