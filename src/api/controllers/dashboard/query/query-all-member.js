module.exports = {
  friendlyName: 'Query all members',
  description: 'Query all members.',
  inputs: {
    id: {
      type: 'number',
      description: 'team.id',
    },
    page: {
      type: 'number',
      description: 'For thread paginate',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Query threads successfully.',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });
    response.pagination = pagination;

    response.team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    try {
      var team = await Team.findOne({ id: response.team.id }).populate('users', {
        sort: 'lastSeenAt DESC',
        limit: pagination.limit,
        skip: pagination.skip,
      });
      response.members = team.users;

      for (let entry of response.members) {
        await User.setGravatarUrl(entry, 36);
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
