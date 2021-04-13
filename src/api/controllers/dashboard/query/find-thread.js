module.exports = {
  friendlyName: 'find threads',
  description: 'find threads.',
  inputs: {
    no: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },
  fn: async function (inputs) {
    var user = await User.findOne({
      id: this.req.me.id,
    }).populate('teams', { where: { deleted: false }, sort: 'id ASC' });
    if (user.teams.length < 1) {
      throw 'notFound';
    }

    var response = await Thread.findOne({
      where: {
        no: inputs.no,
        handleId: this.req.me.organization.handleId,
      },
    });
    if (!response) {
      throw 'notFound';
    }

    response.team = await sails.helpers.validateMembership.with({
      id: response.team,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    return response;
  },
};
