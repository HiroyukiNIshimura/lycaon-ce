module.exports = {
  friendlyName: 'Create Sneeze',
  description: 'Create the Sneeze for the logged-in user.',
  inputs: {
    vote: {
      type: 'number',
      required: true,
    },
    comment: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Sneeze successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var vote = await Vote.findOne({
      id: inputs.vote,
    });
    if (!vote) {
      throw 'notFound';
    }

    if (vote.organization !== this.req.me.organization.id) {
      throw 'notFound';
    }

    var sneeze = {
      comment: inputs.comment,
      vote: vote.id,
      owner: this.req.me.id,
    };

    var created;
    var sNo;

    try {
      await sails.getDatastore().transaction(async (db) => {
        created = await VoteSneeze.create(sneeze).fetch().usingConnection(db);
        sNo = await VoteSneeze.count({ vote: vote.id }).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    vote = await Vote.findOne({ id: vote.id }).populate('users').populate('author');
    var formail = await VoteSneeze.findOne({ id: created.id }).populate('owner');

    for (let entry of vote.users) {
      var data = await sails.helpers.mail.createVoteSneezeMail.with({
        organization: this.req.me.organization,
        vote: vote,
        sneeze: formail,
        target: 'create',
        hashTag: `#sneeze-${sNo}`,
        user: entry,
      });

      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.mailSendTTL,
        job: 'send-email',
        data: data,
      });
    }

    this.req.session.effectMessage = sails.__('Created a comment');

    return {};
  },
};
