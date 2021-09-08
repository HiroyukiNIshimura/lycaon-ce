module.exports = {
  friendlyName: 'validateMembership',
  description: 'Validate team membership utility.',
  inputs: {
    id: {
      type: 'number',
      allowNull: true,
      description: 'team.id',
    },
    user: {
      type: 'ref',
      description: 'user instance',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (!inputs.id) {
      return null;
    }

    var orgId;
    if (_.isObject(inputs.user.organization)) {
      orgId = inputs.user.organization.id;
    } else {
      orgId = inputs.user.organization;
    }

    var team = await Team.findOne({
      id: inputs.id,
      deleted: false,
      organization: orgId,
    }).populate('users', {
      where: {
        id: inputs.user.id,
      },
    });

    if (!team || team.users.length < 1) {
      return null;
    }

    return team;
  },
};
