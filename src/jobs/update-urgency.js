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
        dueDateAt: { '!=': null },
        dueDateAt: { '>': target.valueOf() },
        dueDateAt: { '<=': last.valueOf() },
      },
    });

    if (list.length < 1) {
      return 'skip';
    }

    for (let model of list) {
      var duedate = moment(Number(model.dueDateAt));
      var diff = Math.round(duedate.diff(target, 'days', true));
      if (diff >= 0 && diff < 7) {
        var sets = { urgency: 6 - diff };
        await Thread.updateOne({ id: model.id }).set(sets);
      }
    }
  },
};
