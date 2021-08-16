const moment = require('moment');
module.exports = {
  findAndUpdate: async function () {
    //
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var target = moment(dt.valueOf());
    var last = moment(dt.valueOf()).add(7, 'days');

    var list = await Thread.find({
      where: {
        status: 0,
        dueDateAt: { '>=': target.valueOf(), '<=': last.valueOf() },
        urgency: { '<': 6 },
      },
    });

    if (list.length < 1) {
      return 'skip';
    }

    for (let model of list) {
      var duedate = moment(Number(model.dueDateAt));
      var diff = Math.round(duedate.diff(target, 'days', true));
      var urgency = 0;
      if (diff >= 0 && diff < 7) {
        urgency = 6 - diff;
      } else if (diff < 0) {
        urgency = 6;
      }
      await Thread.updateOne({ id: model.id }).set({ urgency: urgency });
    }
  },
};
