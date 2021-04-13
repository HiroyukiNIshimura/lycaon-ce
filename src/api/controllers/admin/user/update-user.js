module.exports = {
  friendlyName: 'Update user',

  description: 'Update user api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    isSuperAdmin: {
      type: 'boolean',
    },
    deleted: {
      type: 'boolean',
    },
    selectedTeams: {
      type: 'ref',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    unSelectedTeams: {
      statusCode: 405,
      description: 'The provided not selected teams.',
    },
  },

  fn: async function (inputs) {
    if (inputs.selectedTeams.length < 1) {
      throw 'unSelectedTeams';
    }

    var current = await User.findOne({ id: inputs.id, organization: this.req.organization.id });
    if (!current) {
      throw 'notFound';
    }

    if (current.isNologin) {
      throw 'notFound';
    }

    var email = inputs.email.toLowerCase();
    let conflictingUser = await User.findOne({
      id: { '!=': current.id },
      or: [
        {
          emailAddress: email,
        },
        {
          emailChangeCandidate: email,
        },
      ],
    });
    if (conflictingUser) {
      throw 'emailAlreadyInUse';
    }

    try {
      var valuesToSet = {
        emailAddress: email,
        fullName: inputs.name,
        isSuperAdmin: inputs.isSuperAdmin,
        deleted: inputs.deleted,
        emailChangeCandidate: '',
        emailProofToken: '',
        emailProofTokenExpiresAt: 0,
        emailStatus: 'confirmed',
        teams: inputs.selectedTeams.map((o) => o.id),
      };

      await sails.getDatastore().transaction(async (db) => {
        await User.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.updated = true;
    this.req.session.effectMessage = sails.__('Updated the user {0}').format(valuesToSet.fullName);

    return { id: current.id };
  },
};
