module.exports = {
  friendlyName: 'Update team',

  description: 'Update team api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    useGit: {
      type: 'boolean',
    },
    gitOrigin: {
      type: 'string',
      defaultsTo: 'master',
    },
    connectType: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '0:github | 1:gitlab',
    },
    gitRepository: {
      type: 'string',
    },
    gitUser: {
      type: 'string',
    },
    gitPassword: {
      type: 'string',
    },
    gitlabApi: {
      type: 'string',
      isURL: true,
    },
    gitlabToken: {
      type: 'string',
    },
    gitlabProjectId: {
      type: 'string',
    },
    selectedUsers: {
      type: 'json',
    },
    selectedCategories: {
      type: 'json',
    },
    defaultConcept: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
    },
    numberOfThreadsBurden: {
      type: 'number',
      defaultsTo: 20,
    },
    deleted: {
      type: 'boolean',
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided name is already in use.',
    },
    repositoryNotfound: {
      statusCode: 405,
      description: 'repository not founded',
    },
    badRequest: {
      description: 'BadRequest.',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs) {
    var plan = sails.config.custom.plans[this.req.organization.plan];
    if (!plan.allowUseGit) {
      inputs.useGit = false;
    }

    if (inputs.useGit) {
      if (inputs.useGit) {
        var res = await sails.helpers.git.gitRepositoryCheck.with({
          connectType: inputs.connectType,
          gitRepository: inputs.gitRepository,
          gitUser: inputs.gitUser,
          gitPassword: inputs.gitPassword,
          gitlabApi: inputs.gitlabApi,
          gitlabToken: inputs.gitlabToken,
          gitlabProjectId: inputs.gitlabProjectId,
        });
        if (res) {
          throw res;
        }
      }
    }

    var current = await Team.findOne({ id: inputs.id, organization: this.req.organization.id }).populate('users', {
      where: { isNologin: false, isSandbox: false, deleted: false },
    });
    if (!current) {
      throw 'notFound';
    }

    var sames = await Team.count({
      name: inputs.name,
      id: { '!=': inputs.id },
      organization: this.req.organization.id,
    });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    var valuesToSet = {
      name: inputs.name,
      description: inputs.description,
      deleted: inputs.deleted,
      useGit: inputs.useGit,
      gitOrigin: inputs.gitOrigin,
      connectType: inputs.connectType,
      defaultConcept: inputs.defaultConcept,
      numberOfThreadsBurden: inputs.numberOfThreadsBurden,
      gitRepository: '',
      gitUser: '',
      gitPassword: '',
      gitlabApi: '',
      gitlabToken: '',
      gitlabProjectId: '',
    };

    try {
      if (valuesToSet.connectType === 0) {
        valuesToSet.gitRepository = inputs.gitRepository;
        valuesToSet.gitUser = inputs.gitUser;
        valuesToSet.gitPassword = inputs.gitPassword;
      } else {
        valuesToSet.gitlabApi = inputs.gitlabApi;
        valuesToSet.gitlabToken = inputs.gitlabToken;
        valuesToSet.gitlabProjectId = inputs.gitlabProjectId;
      }

      if (inputs.selectedUsers) {
        valuesToSet.users = inputs.selectedUsers.map((o) => o.id);
      }

      if (inputs.selectedCategories) {
        valuesToSet.categories = inputs.selectedCategories.map((o) => o.id);
      }

      await sails.getDatastore().transaction(async (db) => {
        await Team.updateOne({
          id: current.id,
        })
          .set(valuesToSet)
          .usingConnection(db);

        //TODO
        await sails.helpers.mail.sendTeamMail.with({
          id: current.id,
          action: 'update',
          ignores: current.users,
          db: db,
        });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated the team {0}').format(valuesToSet.name);

    return { id: current.id };
  },
};
