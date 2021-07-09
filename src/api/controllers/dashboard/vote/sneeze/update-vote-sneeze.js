module.exports = {
  friendlyName: 'Update Sneeze',
  description: 'Update the Sneeze for the logged-in user.',
  inputs: {
    id: {
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
      description: 'Sneeze successfully updated.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await VoteSneeze.findOne({
      id: inputs.id,
    }).populate('vote');
    if (!current) {
      throw 'notFound';
    }

    if (!current.vote) {
      throw 'notFound';
    }

    if (current.vote.organization !== this.req.me.organization.id) {
      throw 'notFound';
    }

    var sneeze = {
      comment: inputs.comment,
    };

    var sNo;

    try {
      await sails.getDatastore().transaction(async (db) => {
        await VoteSneeze.updateOne({
          id: current.id,
        })
          .set(sneeze)
          .usingConnection(db);

        sNo = await VoteSneeze.count({ vote: current.id }).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var vote = await Vote.findOne({ id: current.vote.id }).populate('users').populate('author');
    var formail = await VoteSneeze.findOne({ id: current.id }).populate('owner');

    for (let entry of vote.users) {
      var data = await sails.helpers.createVoteSneezeMail.with({
        organization: this.req.me.organization,
        vote: vote,
        sneeze: formail,
        target: 'update',
        hashTag: `#sneeze-${sNo}`,
        user: entry,
      });

      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.mailSendTTL,
        job: 'send-email',
        data: data,
      });
    }

    this.req.session.effectMessage = sails.__('Updated comments');

    return {};
  },
};
