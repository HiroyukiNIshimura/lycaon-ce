module.exports = {
  friendlyName: 'Create thread',
  description: 'Create the thread for the logged-in user.',
  inputs: {
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
    team: {
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
    fork: {
      type: 'number',
    },
  },
  exits: {
    success: {
      description: 'Thread successfully created.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    const team = await sails.helpers.validateMembership.with({
      id: inputs.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var emotional = await sails.helpers.emotionCheck.with({
      contents: inputs.subject + '。' + inputs.body,
    });

    var thread = {
      handleId: this.req.organization.handleId,
      subject: inputs.subject,
      body: inputs.body,
      team: inputs.team,
      category: inputs.category,
      local: inputs.local,
      concept: inputs.concept,
      responsible: inputs.responsible ? inputs.responsible : null,
      milestone: inputs.milestone ? inputs.milestone : null,
      owner: this.req.me.id,
      relational: [],
      tags: [],
      accessCount: 0,
      emotional: JSON.stringify(emotional),
      lastHumanUpdateAt: Date.now(),
    };

    if (inputs.milestone) {
      var milestone = await Milestone.findOne({ id: inputs.milestone });
      if (milestone && milestone.startAt && milestone.duration) {
        //マイルストーンが指定されていた際は
        //期限日をマイルストーンの終了日に
        thread.dueDateAt = Number(milestone.startAt) + Number(milestone.duration);
      }
    }

    var parent;
    if (inputs.fork) {
      parent = await Thread.findOne({
        id: inputs.fork,
      });
      if (!parent) {
        throw 'notFound';
      }
      if (inputs.team !== parent.team) {
        throw 'notFound';
      }

      thread.parent = parent.id;
    }

    if (inputs.local) {
      thread.concept = 0;
    }

    var created = {};
    const user = this.req.me;

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

        thread.no = await sails.helpers.storage.getNextval.with({
          target: 'thread',
          handleId: thread.handleId,
        });

        created = await Thread.create(thread).fetch().usingConnection(db);
        if (inputs.fork) {
          await ThreadRef.create({ left: created.parent, right: created.id }).usingConnection(db);
        }

        await sails.helpers.storage.createThreadActivity.with({
          db: db,
          type: 'create',
          user: user,
          thread: created,
          req: this.req,
        });

        if (inputs.fork) {
          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'fork',
            user: this.req.me,
            thread: parent,
            refId: created.id,
            req: this.req,
          });
        }
      });

      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.bot.tweetTTL,
        job: 'similarity-bot',
        data: {
          id: created.id,
          team: created.team,
          subject: created.subject,
          body: created.body,
          organization: this.req.organization,
        },
      });

      await sails.helpers.agendaSchedule.with({
        ttl: Date.now() + sails.config.custom.bot.tweetTTL,
        job: 'tagify-bot',
        data: {
          id: created.id,
          team: created.team,
          organization: this.req.organization,
        },
      });

      if (!created.local) {
        var rooms = [
          `room-${this.req.organization.id}-lycaon`,
          `room-${this.req.organization.id}-team-${created.team}`,
        ];

        sails.sockets.broadcast(rooms, 'thread-notify', {
          message: {
            key: '{0} created Thread [#{1}] {2}',
            params: [this.req.me.fullName, created.no, created.subject],
          },
          user: this.req.me,
          thread: created,
          timespan: Date.now(),
        });
      }

      this.req.session.effectMessage = sails.__('You have created thread');

      return {
        id: created.id,
        no: created.no,
      };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
