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
      required: true,
    },
    body: {
      type: 'string',
    },
    local: {
      type: 'boolean',
    },
    concept: {
      type: 'number',
      required: true,
    },
    tags: {
      type: 'ref',
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
    thread.responsible = inputs.responsible ? inputs.responsible : null;
    thread.milestone = inputs.milestone ? inputs.milestone : null;

    var emotional = await sails.helpers.emotionCheck.with({
      contents: inputs.subject + '。' + inputs.body,
    });
    thread.emotional = JSON.stringify(emotional);

    if (inputs.local) {
      thread.concept = 0;
    }
    if (!inputs.responsible) {
      thread.responsible = null;
    }

    var updated = {};
    var effected = false;

    try {
      await sails.getDatastore().transaction(async (db) => {
        for (let entry of inputs.tags) {
          var tags = await Tag.find()
            .where({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
            .usingConnection(db);

          if (tags.length < 1) {
            tag = await Tag.create({
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

        thread.tagToken = '';
        _.each(thread.tags, (tag) => {
          thread.tagToken += tag + ':';
        });

        updated = await Thread.updateOne({
          id: thread.id,
        })
          .set(thread)
          .usingConnection(db);

        if (current.milestone !== updated.milestone && inputs.refsUpdate === 1) {
          var refs = await ThreadRef.find({ left: updated.id });
          for (let ref of refs) {
            await Thread.updateOne({ id: ref.right })
              .set({ milestone: updated.milestone })
              .usingConnection(db);
          }
        }

        if (current.subject !== updated.subject || current.body !== updated.body) {
          await sails.helpers.createThreadActivity.with({
            db: db,
            type: 'update',
            user: this.req.me,
            thread: updated,
          });

          var message = {
            key: '{0} has updated the subject or body of thread [#{1}] {2}',
            params: [this.req.me.fullName, updated.no, updated.subject],
          };

          //
          sails.sockets.broadcast(
            `room-${this.req.organization.id}-thread-${updated.id}`,
            'thread-update',
            {
              message: message,
              user: this.req.me,
              thread: updated,
            }
          );

          effected = true;
        }

        var localNotify = false;
        if (current.local !== updated.local && updated.local) {
          localNotify = true;
          await sails.helpers.createThreadActivity.with({
            db: db,
            type: 'local',
            user: this.req.me,
            thread: updated,
          });

          effected = true;
        }

        if (current.category !== updated.category) {
          await sails.helpers.createThreadActivity.with({
            db: db,
            type: 'update-category',
            user: this.req.me,
            thread: updated,
          });

          effected = true;
        }

        if (!localNotify && current.concept !== updated.concept) {
          await sails.helpers.createThreadActivity.with({
            db: db,
            type: 'update-concept',
            user: this.req.me,
            thread: updated,
          });

          effected = true;
        }

        if (current.responsible !== updated.responsible) {
          await sails.helpers.createThreadActivity.with({
            db: db,
            type: 'responsible',
            user: this.req.me,
            thread: updated,
          });

          effected = true;
        }

        if (effected) {
          await sails.helpers.sendThreadMailWrapper.with({
            thread: updated.id,
            action: 'update',
            db: db,
          });
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var message = {
      key: '{0} updated Thread [#{1}] {2}',
      params: [this.req.me.fullName, updated.no, updated.subject],
    };

    sails.sockets.broadcast(
      [
        `room-${this.req.organization.id}-lycaon`,
        `room-${this.req.organization.id}-team-${updated.team}`,
      ],
      'thread-notify',
      {
        message: message,
        user: this.req.me,
        thread: updated,
        timespan: Date.now(),
      }
    );

    this.req.session.effectMessage = sails.__('The thread has been updated');

    return { id: updated.id, no: updated.no };
  },
};
