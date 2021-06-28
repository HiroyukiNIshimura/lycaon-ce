const moment = require('moment');

module.exports = {
  friendlyName: 'Get Bardown Chart data',

  description: 'Get Bardown Chart data.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a milestone that has not joined.',
    },
  },

  fn: async function (inputs) {
    var milestone = await Milestone.findOne({ id: inputs.id }).populate('threads', {
      where: { local: false },
    });
    if (!milestone) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: milestone.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    if (!milestone.startAt || !milestone.duration) {
      return {
        message: 'The start and end dates for milestones have not been set',
      };
    }

    //日付け展開
    var days = {};
    var start = moment(Number(milestone.startAt)).startOf('day').add(-1, 'days');
    var end = moment(Number(milestone.startAt) + Number(milestone.duration))
      .startOf('day')
      .add(1, 'days');

    while (true) {
      days[start.format('YYYY/MM/DD')] = {};
      start = start.add(1, 'days');
      if (start.format('YYYY/MM/DD') === end.format('YYYY/MM/DD')) {
        break;
      }
    }

    var daysLen = _.keys(days).length;
    var tasks = milestone.threads.length;
    if (tasks < 1) {
      return {
        message: 'There are no threads at the milestone',
      };
    }

    team = await Team.findOne({
      id: team.id,
    }).populate('users', {
      where: {
        isNologin: false,
        isSandbox: false,
      },
    });

    var members = _.forEach(team.users, (o) => {
      o.burden = 0;
    });

    var openClose = {
      memberQty: members.length,
      threadQty: milestone.threads.length,
      days: daysLen - 1,
      workingHoursPerDay: this.req.sysSettings.workingHoursPerDay,
      openCloseElapsed: 0,
      workingCloseElapsed: 0,
    };

    for (let thread of milestone.threads) {
      thread.closeFormatedAt = '';
      thread.dueDateFormatedAt = end.format('YYYY/MM/DD');

      if (thread.status === 1) {
        var activites = await ThreadActivity.find({
          thread: thread.id,
          type: ['update-status'],
          stateWord: 'close',
        }).sort('updatedAt ASC');

        if (activites.length < 1) {
          thread.closeFormatedAt = moment(Number(thread.lastHumanUpdateAt)).format('YYYY/MM/DD');
        } else {
          thread.closeFormatedAt = moment(Number(_.last(activites).updatedAt)).format('YYYY/MM/DD');
        }
      }

      if (thread.dueDateAt) {
        thread.dueDateFormatedAt = moment(Number(thread.dueDateAt)).format('YYYY/MM/DD');
      }

      if (thread.openCloseElapsed) {
        openClose.openCloseElapsed += Number(thread.openCloseElapsed);
      }

      if (thread.workingCloseElapsed) {
        openClose.workingCloseElapsed += Number(thread.workingCloseElapsed);
      }

      if (thread.responsible) {
        var responsible = _.find(members, { id: thread.responsible });
        if (responsible) {
          responsible.burden++;
        }
      }
    }

    openClose.members = _.sortByOrder(members, ['burden'], ['desc']);
    var qtyOfDay = tasks / (daysLen - 1);

    //理想値
    var remaining = tasks;
    var i = 0;
    _.mapKeys(days, (value) => {
      value.ideal = remaining;
      remaining -= qtyOfDay;
      i++;
      if (i === daysLen) {
        value.ideal = 0;
      }
    });

    //計画値
    remaining = tasks;
    _.mapKeys(days, (value, key) => {
      remaining -= _.filter(milestone.threads, (o) => {
        return o.dueDateFormatedAt === key;
      }).length;
      value.plan = remaining;
    });

    //実績値
    remaining = tasks;
    _.mapKeys(days, (value, key) => {
      remaining -= _.filter(milestone.threads, (o) => {
        return o.closeFormatedAt === key;
      }).length;
      value.achievement = remaining;
    });

    return {
      burndown: days,
      openClose: openClose,
    };
  },
};
