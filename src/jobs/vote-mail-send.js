module.exports = {
  releaseMail: async function () {
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    try {
      //公開メール送信
      var list = await Vote.find({
        mailSended: false,
        circulationFrom: { '<=': dt.valueOf() },
      })
        .populate('organization')
        .populate('users', { where: { isNologin: false, isSandbox: false, deleted: false } })
        .populate('author');

      for (let vote of list) {
        var target = 'create';
        if (vote.createdAt !== vote.updatedAt) {
          target = 'update';
        }

        for (let entry of vote.users) {
          let data = await sails.helpers.mail.createVoteMail.with({
            organization: vote.organization,
            vote: vote,
            author: vote.author,
            target: target,
            user: entry,
          });

          await sails.helpers.mail.sendTemplateEmail.with(data);
        }

        await Vote.updateOne({ id: vote.id }).set({ mailSended: true });
      }

      //回覧未確認者にメール送信
      var expier = dt.valueOf() + sails.config.custom.agenda.jobs.votemail.expier;

      list = await Vote.find({
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
      //
    } catch (err) {
      sails.log.error(err);
    }
  },
};
