module.exports = {
  friendlyName: 'View list',
  description: 'Display "List" page.',
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
      viewTemplatePath: 'pages/admin/wiki/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.adminGridRowPerPage,
    });
    response.pagination = pagination;

    var teams = await Team.find({ organization: this.req.organization.id });

    response.records = await Wiki.count({
      concept: 0,
      team: {
        in: teams.map((o) => {
          return o.id;
        }),
      },
    });
    response.wikis = await Wiki.find({
      where: {
        concept: 0,
        team: {
          in: teams.map((o) => {
            return o.id;
          }),
        },
      },
      sort: [{ createdAt: 'DESC' }, { id: 'ASC' }],
      limit: pagination.limit,
      skip: pagination.skip,
    })
      .populate('items')
      .populate('tags', {
        sort: 'name',
      })
      .populate('team')
      .populate('owner')
      .populate('lastUpdateUser')
      .populate('fans', { where: { id: this.req.me.id } });

    for (let entry of response.wikis) {
      await User.setGravatarUrl(entry.owner, 36);
      await User.setGravatarUrl(entry.lastUpdateUser, 36);

      entry.sanitizeHtml = await sails.helpers.sanitizeDescription.with({
        markdown: entry.body,
        max: 200,
      });
      delete entry.body;
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
