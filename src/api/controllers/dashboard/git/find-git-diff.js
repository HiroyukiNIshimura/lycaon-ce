module.exports = {
  friendlyName: 'View git show diff api',
  description: 'View git show diff api.',
  inputs: {
    id: {
      type: 'number',
      description: 'gitlog.id',
      required: true,
    },
    row: {
      type: 'number',
      isInteger: true,
      min: 0,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var gitlog = await GitLog.findOne({
      id: inputs.id,
    }).populate('team');
    if (!gitlog || !gitlog.team) {
      throw 'notFound';
    }

    var response = {};

    if (gitlog.team.connectType === 0) {
      response = await sails.helpers.git.githubShow.with({
        gitlog: gitlog,
        row: inputs.row,
        me: this.req.me,
      });
    } else {
      response = await sails.helpers.git.gitlabShow.with({
        gitlog: gitlog,
        row: inputs.row,
        me: this.req.me,
      });
    }

    return response;
  },
};
