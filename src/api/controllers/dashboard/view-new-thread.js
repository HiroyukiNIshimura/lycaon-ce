module.exports = {
  friendlyName: 'View new thread page',
  description: 'Display the new "thread" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    id: {
      type: 'number',
      required: true,
      description: 'team.id',
    },
    thread: {
      type: 'number',
      description: 'フォーク元のthread.id',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/new-thread',
      description: 'Display the new thread page for users.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    if (inputs.thread) {
      response.fork = await Thread.findOne({
        id: inputs.thread,
      })
        .populate('category')
        .populate('tags', {
          sort: 'name',
        })
        .populate('responsible')
        .populate('owner');
      if (!response.fork) {
        throw 'notFound';
      }
    }

    var grp = await Team.findOne({ id: response.team.id }).populate('users', {
      sort: 'fullName ASC',
    });
    response.members = grp.users;
    for (let entry of response.members) {
      await User.setGravatarUrl(entry, 36);
    }

    //コンボ用
    var team = await Team.findOne({ id: response.team.id })
      .populate('users', {
        where: { isNologin: false },
        sort: 'lastSeenAt DESC',
      })
      .populate('categories', {
        sort: 'displayOrder ASC',
      });
    response.comboMembers = team.users;
    response.categories = team.categories;

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    response.milestone = await Milestone.find({ team: response.team.id }).sort('lineNo ASC');

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    return response;
  },
};
