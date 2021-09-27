module.exports = {
  friendlyName: 'git.gitRepositoryCheck',
  description: 'check git repository access.',
  inputs: {
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
    },
    gitlabToken: {
      type: 'string',
    },
    gitlabProjectId: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (inputs.connectType === 0) {
      if (!inputs.gitUser) {
        return 'badRequest';
      }
      if (!inputs.gitRepository) {
        return 'badRequest';
      }

      let url = new URL(`https://api.github.com/repos/${inputs.gitUser}/${inputs.gitRepository}`);

      var headers = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (inputs.gitPassword) {
        headers.Authorization = `token ${inputs.gitPassword}`;
      }

      if (
        !(await sails.helpers.checkUrl.with({
          url: url.href,
          headers: headers,
        }))
      ) {
        return 'repositoryNotfound';
      }
    } else {
      if (!inputs.gitlabApi) {
        return 'badRequest';
      }
      if (!inputs.gitlabProjectId) {
        return 'badRequest';
      }

      let url = new URL(`${inputs.gitlabApi}/projects/${inputs.gitlabProjectId}/repository/commits`);
      if (inputs.gitlabToken) {
        url.search = `private_token=${inputs.gitlabToken}`;
      }

      if (!(await sails.helpers.checkUrl.with({ url: url.href }))) {
        return 'repositoryNotfound';
      }
    }

    return false;
  },
};
