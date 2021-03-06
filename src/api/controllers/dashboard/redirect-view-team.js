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
    owner: {
      type: 'number',
    },
    responsible: {
      type: 'number',
    },
    category: {
      type: 'number',
    },
    target: {
      type: 'string',
      isIn: ['thread', 'wiki'],
      defaultsTo: 'thread',
    },
    tag: {
      type: 'number',
    },
  },
  exits: {
    redirect: {
      responseType: 'redirect',
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

    this.res.cookie('teamQueryParam', {
      milestone: inputs.milestone,
      owner: inputs.owner,
      responsible: inputs.responsible,
      category: inputs.category,
      target: inputs.target,
      tag: inputs.tag,
    });

    throw { redirect: `/${this.req.organization.handleId}/team/${inputs.id}` };
  },
};
