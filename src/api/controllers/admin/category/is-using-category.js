module.exports = {
  friendlyName: 'using cheak category',

  description: 'using cheak category api.',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Category.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    })
      .populate('threads')
      .populate('teams');

    if (!current) {
      throw 'notFound';
    }

    var response = {
      usingThread: false,
      usingTeam: false,
    };

    if (current.threads && current.threads.length > 0) {
      response.usingThread = true;
    }

    if (current.teams && current.teams.length > 0) {
      response.usingTeam = true;
    }

    return response;
  },
};
