module.exports = {
  closeMail: async function () {
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    try {
      //回覧未確認者にメール送信
      //期限のN日前
      var expier = dt.valueOf() + sails.config.custom.agenda.jobs.votemail.expier;

      var list = await Vote.find({
        mailSended: true,
        circulationTo: expier,
      })
        .populate('organization')
        .populate('users')
        .populate('author')
        .populate('answers');

      for (let vote of list) {
        for (let entry of vote.users) {
          let exists = _.findIndex(vote.answers, (o) => {
            return o.user === entry.id;
          });

          if (exists < 0) {
            let data = await sails.helpers.mail.createVoteMail.with({
              organization: vote.organization,
              vote: vote,
              author: vote.author,
              target: 'create',
              user: entry,
              unread: true,
            });
            await sails.helpers.mail.sendTemplateEmail.with(data);
          }
          //
        }
      }

      //アンケート終了の通知
      //期限のN日後
      expier = dt.valueOf() - sails.config.custom.agenda.jobs.votemail.expier;
      list = await Vote.find({
        mailSended: true,
        circulationTo: expier,
      })
        .populate('organization')
        .populate('users');

      for (let vote of list) {
        for (let entry of vote.users) {
          let data = await sails.helpers.mail.createVoteAnseweredMail.with({
            organization: vote.organization,
            vote: vote,
            user: entry,
            expired: true
          });

          await sails.helpers.mail.sendTemplateEmail.with(data);
        }
      }

      //
    } catch (err) {
      sails.log.error(err);
    }
  },
};
