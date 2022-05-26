module.exports = {
  releaseMail: async function () {
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    try {
      //回覧公開メール送信
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

      //
    } catch (err) {
      sails.log.error(err);
    }
  },
};
