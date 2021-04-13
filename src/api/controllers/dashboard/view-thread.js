module.exports = {
  friendlyName: 'View thread page',
  description: 'Display the dashboard "thread" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    no: {
      type: 'number',
      required: true,
      description: 'thread.no',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/thread',
      description: 'Display the thread page for users.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.thread = await Thread.findOne({
      no: inputs.no,
      handleId: inputs.handleId,
    })
      .populate('category')
      .populate('tags', {
        sort: 'name',
      })
      .populate('responsible')
      .populate('owner')
      .populate('workingUser')
      .populate('milestone')
      .populate('parent')
      .populate('fans', { where: { id: this.req.me.id } });
    if (!response.thread) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.thread.owner, 36);
    await User.setGravatarUrl(response.thread.responsible, 36);
    await User.setGravatarUrl(response.thread.workingUser, 36);

    response.isFan = false;
    if (response.thread.fans.length > 0) {
      response.isFan = true;
    }

    response.team = await sails.helpers.validateMembership.with({
      id: response.thread.team,
      user: this.req.me,
    });

    if (!response.team) {
      throw 'notFound';
    }

    if (response.thread.emotional) {
      response.thread.emotional = JSON.parse(response.thread.emotional);
    }

    var team = await Team.findOne({ id: response.team.id }).populate('users', {
      sort: 'lastSeenAt DESC',
      limit: 10,
      skip: 0,
    });
    response.members = team.users;
    for (let entry of response.members) {
      await User.setGravatarUrl(entry, 36);
    }

    response.milestone = await Milestone.find({ team: response.team.id }).sort('lineNo ASC');

    //コンボ用
    team = await Team.findOne({ id: response.team.id })
      .populate('users', {
        where: { isNologin: false },
        sort: 'lastSeenAt DESC',
      })
      .populate('categories', {
        where: { deleted: false },
        sort: 'displayOrder ASC',
      });
    response.comboMembers = team.users;
    response.categories = team.categories;

    response.memberQty = await sails.models['team_users__user_teams'].count({
      team_users: response.team.id,
    });

    response.sneezes = await Sneeze.find({
      where: {
        thread: response.thread.id,
        deleted: false,
      },
      sort: 'id ASC',
    }).populate('owner');

    for (let entry of response.sneezes) {
      await User.setGravatarUrl(entry.owner);
    }

    response.replys = await Reply.find({
      where: {
        thread: response.thread.id,
        deleted: false,
      },
      sort: 'id ASC',
    }).populate('owner');

    for (let entry of response.replys) {
      await User.setGravatarUrl(entry.owner);
    }

    response.activities = await ThreadActivity.find({
      where: {
        thread: response.thread.id,
      },
      sort: 'id ASC',
    }).populate('user');

    for (let entry of response.activities) {
      if (entry.sneeze) {
        entry.sneeze = _.find(response.sneezes, {
          id: entry.sneeze,
        });
      }

      if (entry.reply) {
        entry.reply = _.find(response.replys, {
          id: entry.reply,
        });
      }
      await User.setGravatarUrl(entry.user, 36);
    }

    var i = 1;
    _.each(response.sneezes, (entry) => {
      entry.serialNumber = i;
      var replys = _.where(response.replys, {
        sneeze: entry.id,
      });
      var j = 1;
      _.each(replys, (entry) => {
        var reply = _.find(response.replys, {
          id: entry.id,
        });
        entry.serialNumber = j;
        reply.serialNumber = j;

        j++;
      });
      i++;
    });

    response.thread.items = await ThreadItem.find({
      where: {
        thread: response.thread.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');
    for (let item of response.thread.items) {
      await User.setGravatarUrl(item.owner, 36);
    }

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');

    if (response.thread.parent) {
      response.fork = response.thread.parent;
    }
    var refs = await ThreadRef.find({ left: response.thread.id }).populate('right');
    response.children = [];
    for (let ref of refs) {
      if (response.fork && ref.right.id === response.fork.id) {
        continue;
      }
      response.children.push(ref.right);
    }

    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    if (this.req.session.errorMessage) {
      response.errorMessage = this.req.session.errorMessage;
      delete this.req.session.errorMessage;
    }

    return response;
  },
};
