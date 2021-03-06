const moment = require('moment');

module.exports = {
  friendlyName: 'Update thread duedate',
  description: 'Update the thread duedate.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    dueDate: {
      type: 'number',
      allowNull: true,
    },
  },
  exits: {
    success: {
      description: `Thread's status successfully updated.`,
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Thread.findOne({
      id: inputs.id,
    }).populate('milestone');
    if (!current) {
      throw 'notFound';
    }

    if (current.dueDateAt === inputs.dueDate) {
      return;
    }

    if (current.milestone && current.milestone.startAt && current.milestone.duration && inputs.dueDate) {
      var start = moment(Number(current.milestone.startAt)).startOf('day').valueOf();
      var end = Number(start) + Number(current.milestone.duration);
      if (end < inputs.dueDate || start > inputs.dueDate) {
        throw 'badRequest';
      }
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var urgency = 0;
    if (inputs.dueDate) {
      var dt = new Date();
      dt.setHours(0, 0, 0, 0);
      var target = moment(dt);
      var duedate = moment(Number(inputs.dueDate));
      var diff = Math.round(duedate.diff(target, 'days', true));
      if (diff >= 0 && diff < 7) {
        urgency = 6 - diff;
      } else if (diff < 0) {
        urgency = 6;
      }
    }

    var valueSet = {
      dueDateAt: inputs.dueDate,
      urgency: urgency,
      lastUpdateUser: this.req.me.id,
      lastHumanUpdateAt: Date.now(),
    };
    var updated = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        updated = await Thread.updateOne({
          id: current.id,
        })
          .set(valueSet)
          .usingConnection(db);

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'update-duedate',
          user: this.req.me,
          thread: updated,
          req: this.req,
        });

        await sails.helpers.mail.sendThreadMailWrapper.with({
          thread: updated.id,
          action: 'dueDate',
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var message = {
      key: '{0} has deleted the due date for thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    if (updated.dueDateAt) {
      message = {
        key: '{0} has set a due date for thread [#{1}] {2}',
        params: [this.req.me.fullName, updated.no, updated.subject],
      };
    }

    if (!updated.local) {
      var rooms = [
        `room-${this.req.organization.id}-lycaon`,
        `room-${this.req.organization.id}-team-${team.id}`,
        `room-${this.req.organization.id}-thread-${updated.id}`,
      ];

      sails.sockets.broadcast(rooms, 'thread-notify', {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      });
    }

    //

    this.req.session.effectMessage = sails.__('The due date has been updated');

    return {};
  },
};
