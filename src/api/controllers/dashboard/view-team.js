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
    milestone: {
      type: 'number',
    },
    tag: {
      type: 'number',
    },
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
    target: {
      type: 'string',
      isIn: ['thread', 'wiki'],
      defaultsTo: 'thread',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/team',
      description: 'Display the team page for users.',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
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

    var team = await Team.findOne({ id: inputs.id }).populate('users', {
      sort: 'lastSeenAt DESC',
      limit: 10,
      skip: 0,
    });
    response.members = team.users;
    for (let entry of response.members) {
      await User.setGravatarUrl(entry);
    }

    //コンボ用
    team = await Team.findOne({ id: inputs.id })
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

    var user = await User.findOne({
      id: this.req.me.id,
    }).populate('flags');

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    response.team.summary = {
      total: await Thread.count().where({ team: inputs.id }),
      open: await Thread.count().where({ team: inputs.id, status: 0 }),
      working: await Thread.count().where({ team: inputs.id, status: 0, working: true }),
      expired: await Thread.count().where({
        team: inputs.id,
        status: 0,
        dueDateAt: { '<': dt.valueOf() },
      }),
      notAssignment: await Thread.count().where({
        team: inputs.id,
        status: 0,
        responsible: null,
      }),
    };

    response.counter = await sails.helpers.queryCounter.with({
      team: response.team.id,
      flags: user.flags.map((o) => {
        return o.id;
      }),
      user: user,
    });

    response.milestone = await Milestone.find({ team: team.id }).sort('lineNo ASC');
    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');

    response.currentPage = 1;
    response.isTeamPage = team.id;

    if (inputs.milestone) {
      response.query = {
        milestone: inputs.milestone,
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
    } else if (inputs.tag) {
      if (inputs.target === 'thread') {
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
          tagQuery: _.find(response.tags, { id: inputs.tag }),
          resultTarget: 'thread',
        };
      } else {
        response.wikiQuery = {
          flag: false,
          tagQuery: _.find(response.tags, { id: inputs.tag }),
        };
      }
    }

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
