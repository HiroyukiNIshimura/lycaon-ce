module.exports = {
  friendlyName: 'create vote',

  description: 'create vote.',

  inputs: {
    subject: {
      type: 'string',
      required: true,
      maxLength: 200,
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
      maxLength: 200,
    },
    circulationFrom: {
      type: 'number',
      required: true,
      description: '回覧期間FROM',
    },
    circulationTo: {
      type: 'number',
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
  },

  exits: {
    success: {},
  },

  fn: async function (inputs) {
    var valuesToSet = {
      subject: inputs.subject,
      body: inputs.body,
      isQuestionnaireFormat: inputs.isQuestionnaireFormat,
      question: inputs.question,
      circulationFrom: inputs.circulationFrom,
      circulationTo: inputs.circulationTo,
      multipleAnswers: inputs.multipleAnswers,
      hasOther: inputs.hasOther,
      author: this.req.me.id,
      organization: this.req.me.organization.id,
    };

    if (inputs.users) {
      valuesToSet.users = inputs.users.map((o) => o.id);
    }

    var created = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        created = await Vote.create(valuesToSet).fetch().usingConnection(db);

        if (inputs.isQuestionnaireFormat) {
          var choicesToSets = [];
          for (let entry of inputs.choices) {
            choicesToSets.push({
              choices: entry.value,
              isOther: false,
              vote: created.id,
            });
          }
          if (created.hasOther) {
            choicesToSets.push({
              choices: sails.__('Other'),
              isOther: true,
              vote: created.id,
            });
          }

          await VoteChoices.createEach(choicesToSets).usingConnection(db);
        } else {
          await VoteChoices.create({
            choices: 'Browsed',
            isOther: false,
            vote: created.id,
          }).usingConnection(db);
        }
      });

      if (created.circulationFrom <= Date.now()) {
        var formail = await Vote.findOne({ id: created.id }).populate('users').populate('author');
        for (let entry of formail.users) {
          var data = await sails.helpers.createVoteMail.with({
            organization: this.req.me.organization,
            vote: formail,
            author: formail.author,
            target: 'create',
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

      this.req.session.effectMessage = sails.__('Created a circulate notice');

      return {
        id: created.id,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
