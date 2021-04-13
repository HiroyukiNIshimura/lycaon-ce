module.exports = {
  friendlyName: 'View main page',
  description: 'Display the dashboard "main" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/main',
      description: 'Display the main page for users.',
    },
    redirect: {
      responseType: 'redirect',
    },
  },
  fn: async function (inputs) {
    var response = {
      teams: [],
      counter: {
        myThread: 0,
        working: 0,
        flag: 0,
        local: 0,
      },
      categories: [],
      tags: [],
    };

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });
    response.threadPagination = pagination;

    var user = await User.findOne({
      id: this.req.me.id,
    })
      .populate('teams', { where: { deleted: false }, sort: 'id ASC' })
      .populate('flags');

    if (user.teams.length < 1) {
      return response;
    }
    response.teams = user.teams;

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);

    for (team of response.teams) {
      team.summary = {
        total: await Thread.count().where({ team: team.id }),
        open: await Thread.count().where({ team: team.id, status: 0 }),
        working: await Thread.count().where({ team: team.id, status: 0, working: true }),
        expired: await Thread.count().where({
          team: team.id,
          status: 0,
          dueDateAt: { '<': dt.valueOf() },
        }),
        notAssignment: await Thread.count().where({ team: team.id, status: 0, responsible: null }),
      };
    }

    response.counter = await sails.helpers.queryCounter.with({
      team: response.teams.map((o) => {
        return o.id;
      }),
      flags: user.flags.map((o) => {
        return o.id;
      }),
      user: user,
    });

    response.categories = await Category.find()
      .where({ organization: this.req.organization.id, deleted: false })
      .sort('displayOrder ASC');
    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');

    response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
