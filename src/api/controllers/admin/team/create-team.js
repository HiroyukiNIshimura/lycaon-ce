module.exports = {
  friendlyName: 'Create team',

  description: 'Create team api.',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    selectedUsers: {
      type: 'ref',
    },
    selectedCategories: {
      type: 'ref',
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
      description: '0:github、1:gitlab',
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
    defaultConcept: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
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
    unplanned: {
      statusCode: 405,
      description: 'Out of range of plan.',
    },
    badRequest: {
      description: 'BadRequest.',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs) {
    if (!(await sails.helpers.planingTeam.with({ organization: this.req.organization.id }))) {
      throw 'unplanned';
    }

    var sames = await Team.count({ name: inputs.name, organization: this.req.organization.id });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    var plan = sails.config.custom.plans[this.req.organization.plan];
    if (!plan.allowUseGit) {
      inputs.useGit = false;
    }

    if (inputs.useGit) {
      var res = await sails.helpers.gitRepositoryCheck.with(inputs);
      if (res) {
        return res;
      }
    }

    var created = {};
    try {
      var valuesToSet = {
        name: inputs.name,
        description: inputs.description,
        useGit: inputs.useGit,
        gitOrigin: inputs.gitOrigin,
        connectType: inputs.connectType,
        defaultConcept: inputs.defaultConcept,
        gitRepository: '',
        gitUser: '',
        gitPassword: '',
        gitlabApi: '',
        gitlabToken: '',
        gitlabProjectId: '',
        organization: this.req.organization.id,
      };

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
        created = await Team.create(valuesToSet).fetch().usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails
      .__('You have created a team {0}')
      .format(valuesToSet.name);

    return {
      id: created.id,
      name: created.name,
    };
  },
};
