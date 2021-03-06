const DiffMatchPatch = require('diff-match-patch');

module.exports = {
  friendlyName: 'Update thread',
  description: 'Update the thread',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    subject: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 200;
      },
      required: true,
    },
    body: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
    },
    local: {
      type: 'boolean',
    },
    concept: {
      type: 'number',
      required: true,
    },
    tags: {
      type: 'json',
    },
    category: {
      type: 'number',
      required: true,
    },
    responsible: {
      type: 'number',
    },
    milestone: {
      type: 'number',
    },
    refsUpdate: {
      type: 'number',
      isIn: [0, 1, 2],
      defaultsTo: 0,
    },
  },
  exits: {
    success: {
      description: 'Thread successfully updated.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    alreadyLocked: {
      statusCode: 405,
      description: 'this thread is locked',
    },
  },

  fn: async function (inputs) {
    var current = await Thread.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    if (current.locked) {
      throw 'alreadyLocked';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var thread = _.clone(inputs);
    thread.tags = [];
    thread.lastUpdateUser = this.req.me.id;
    thread.lastHumanUpdateAt = Date.now();
    thread.responsible = inputs.responsible ? inputs.responsible : null;
    thread.milestone = inputs.milestone ? inputs.milestone : null;

    if (current.body !== thread.body) {
      const dmp = new DiffMatchPatch();
      const diff = dmp.diff_main(current.body, thread.body);
      thread.previous = JSON.stringify(diff);
    }

    var milestone;
    if (inputs.milestone) {
      milestone = await Milestone.findOne({ id: inputs.milestone });
      if (milestone && milestone.startAt && milestone.duration && current.dueDateAt) {
        if (
          Number(milestone.startAt) > Number(current.dueDateAt) ||
          Number(milestone.startAt) + Number(milestone.duration) < Number(current.dueDateAt)
        ) {
          //???????????????????????????????????????????????????????????????????????????????????????????????????
          thread.dueDateAt = Number(milestone.startAt) + Number(milestone.duration);
        }
      }
    }

    var emotional = await sails.helpers.emotionCheck.with({
      contents: inputs.subject + '???' + inputs.body,
    });
    thread.emotional = JSON.stringify(emotional);

    if (inputs.local) {
      thread.concept = 0;
    }
    if (!inputs.responsible) {
      thread.responsible = null;
    }

    var updated = {};

    //???????????????????????????true
    var effected = false;
    var effectedOnlySubject = false;

    try {
      await sails.getDatastore().transaction(async (db) => {
        for (let entry of inputs.tags) {
          let tags = await Tag.find()
            .where({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
            .usingConnection(db);

          if (tags.length < 1) {
            let tag = await Tag.create({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
              .fetch()
              .usingConnection(db);
            thread.tags.push(tag.id);
          } else {
            thread.tags.push(tags[0].id);
          }
        }

        thread.tagToken = ':';
        _.each(thread.tags, (tag) => {
          thread.tagToken += tag + ':';
        });

        updated = await Thread.updateOne({
          id: thread.id,
        })
          .set(thread)
          .usingConnection(db);

        if (updated.milestone && current.milestone !== updated.milestone && inputs.refsUpdate === 1) {
          var refs = await ThreadRef.find({ left: updated.id });
          for (let ref of refs) {
            var vals = {
              milestone: updated.milestone,
            };
            if (milestone && milestone.startAt && milestone.duration) {
              //?????????????????????????????????????????????????????????????????????
              //????????????????????????????????????????????????
              vals.dueDateAt = Number(milestone.startAt) + Number(milestone.duration);
            }
            await Thread.updateOne({ id: ref.right }).set(vals).usingConnection(db);
          }
        }

        if (current.subject !== updated.subject && current.body === updated.body) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'update-subject',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effectedOnlySubject = true;
        } else if (current.subject !== updated.subject || current.body !== updated.body) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'update',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (current.subject !== updated.subject || current.body !== updated.body) {
          var message = {
            key: '{0} has updated the subject or body of thread [#{1}] {2}',
            params: [this.req.me.fullName, updated.no, updated.subject],
          };

          //
          sails.sockets.broadcast(`room-${this.req.organization.id}-thread`, 'thread-update', {
            message: message,
            user: this.req.me,
            thread: updated,
          });
        }

        var localNotify = false;
        if (current.local !== updated.local && updated.local) {
          localNotify = true;
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'local',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (current.category !== updated.category) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'update-category',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (!localNotify && current.concept !== updated.concept) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'update-concept',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (current.responsible !== updated.responsible) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'responsible',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (current.milestone !== updated.milestone) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'milestone',
            user: this.req.me,
            thread: updated,
            req: this.req,
          });

          effected = true;
        }

        if (effected) {
          await sails.helpers.mail.sendThreadMailWrapper.with({
            thread: updated.id,
            action: 'update',
            db: db,
          });
        } else {
          if (effectedOnlySubject) {
            await sails.helpers.mail.sendThreadMailWrapper.with({
              thread: updated.id,
              action: 'update-subject',
              db: db,
            });
          }
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    if (effected) {
      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.bot.tweetTTL,
        job: 'tagify-bot',
        data: {
          id: updated.id,
          team: updated.team,
          organization: this.req.organization,
        },
      });
    }

    if (!updated.local) {
      var message = {
        key: '{0} updated Thread [#{1}] {2}',
        params: [this.req.me.fullName, updated.no, updated.subject],
      };

      var rooms = [
        `room-${this.req.organization.id}-lycaon`,
        `room-${this.req.organization.id}-team-${updated.team}`,
        `room-${this.req.organization.id}-thread-${updated.id}`,
      ];

      sails.sockets.broadcast(rooms, 'thread-notify', {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      });
    }

    this.req.session.effectMessage = sails.__('The thread has been updated');

    return { id: updated.id, no: updated.no };
  },
};
