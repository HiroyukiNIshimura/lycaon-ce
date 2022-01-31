module.exports = {
  friendlyName: 'View team page',
  description: 'Display the dashboard "team" page.',
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
    tab: {
      type: 'string',
      isIn: ['team', 'working', 'charge', 'flag', 'private', 'activity', 'git', 'wiki', 'circular'],
      defaultsTo: 'team',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/team',
      description: 'Display the team page for users.',
    },
    redirect: {
      responseType: 'redirect',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {
      tab: 'tab-' + inputs.tab,
    };

    response.team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    var team = await Team.findOne({ id: inputs.id }).populate('users', {
      sort: [{ lastSeenAt: 'DESC' }, { id: 'ASC' }],
      limit: 10,
      skip: 0,
    });
    response.members = team.users;
    for (let entry of response.members) {
      let results = await sails.helpers.burdenCheck.with({ team: team, user: entry });
      entry.mold = results.mold;
      entry.loadQty = results.loadQty;
      await User.setGravatarUrl(entry);
    }

    //コンボ用
    team = await Team.findOne({ id: inputs.id })
      .populate('users', {
        where: { isNologin: false },
        sort: 'lastSeenAt DESC',
      })
      .populate('categories', {
        sort: 'displayOrder ASC',
      });
    response.comboMembers = team.users;
    response.categories = team.categories;

    response.memberQty = await sails.models['team_users__user_teams'].count({
      // eslint-disable-next-line camelcase
      team_users: response.team.id,
    });

    var user = await User.findOne({
      id: this.req.me.id,
    }).populate('threadFlags');

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    response.team.summary = {
      total: await Thread.count().where({ team: inputs.id, local: false }),
      open: await Thread.count().where({ team: inputs.id, status: 0, local: false }),
      working: await Thread.count().where({
        team: inputs.id,
        status: 0,
        working: true,
        local: false,
      }),
      expired: await Thread.count().where({
        team: inputs.id,
        status: 0,
        dueDateAt: { '<': dt.valueOf() },
        local: false,
      }),
      notAssignment: await Thread.count().where({
        team: inputs.id,
        status: 0,
        responsible: null,
        local: false,
      }),
    };

    response.counter = await sails.helpers.storage.queryCounter.with({
      team: response.team.id,
      flags: user.threadFlags.map((o) => {
        return o.thread;
      }),
      user: user,
    });

    response.milestone = await Milestone.find({ team: team.id }).sort('lineNo ASC');
    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');

    response.currentPage = 1;
    response.isTeamPage = team.id;

    if (this.req.cookies.teamQueryParam) {
      if (this.req.cookies.teamQueryParam.milestone) {
        response.query = {
          milestone: this.req.cookies.teamQueryParam.milestone,
          category: '',
          responsible: '',
          concept: '',
          status: '',
          owner: '',
          locked: '',
          priority: '',
          working: false,
          flag: false,
          tags: [],
          sustain: false,
          sort: 0,
          word: '',
          resultTarget: 'thread',
        };
      } else if (this.req.cookies.teamQueryParam.owner) {
        response.query = {
          milestone: '',
          category: '',
          responsible: '',
          concept: '',
          status: '',
          owner: this.req.cookies.teamQueryParam.owner,
          locked: '',
          priority: '',
          working: false,
          flag: false,
          tags: [],
          sustain: false,
          sort: 0,
          word: '',
          resultTarget: 'thread',
        };
      } else if (this.req.cookies.teamQueryParam.responsible) {
        response.query = {
          milestone: '',
          category: '',
          responsible: this.req.cookies.teamQueryParam.responsible,
          concept: '1',
          status: '0',
          owner: '',
          locked: '',
          priority: '',
          working: false,
          flag: false,
          tags: [],
          sustain: false,
          sort: 0,
          word: '',
          resultTarget: 'thread',
        };
      } else if (this.req.cookies.teamQueryParam.tag) {
        if (this.req.cookies.teamQueryParam.target === 'thread') {
          response.query = {
            milestone: '',
            category: '',
            responsible: '',
            concept: '',
            status: '',
            owner: '',
            locked: '',
            priority: '',
            working: false,
            flag: false,
            tags: [],
            sustain: false,
            sort: 0,
            word: '',
            tagQuery: _.find(response.tags, { id: this.req.cookies.teamQueryParam.tag }),
            resultTarget: 'thread',
          };
        } else {
          response.wikiQuery = {
            flag: false,
            tagQuery: _.find(response.tags, { id: this.req.cookies.teamQueryParam.tag }),
          };
        }
      }

      this.res.clearCookie('teamQueryParam');
    }

    response.accessList = await ThreadAccess.find({
      where: { user: this.req.me.id, team: response.team.id },
      sort: [{ count: 'DESC' }, { lastAccessAt: 'DESC' }],
      limit: 10,
      skip: 0,
    }).populate('thread');

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
