module.exports = {
  friendlyName: 'View page',

  description: 'Display "" page.',
  inputs: {
    id: {
      type: 'number',
      description: 'wiki.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/doc/page',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a doc that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    if (inputs.id) {
      response.wiki = await Wiki.findOne({
        id: inputs.id,
        concept: 1,
        deleted: false,
      })
        .populate('tags', {
          sort: 'name',
        })
        .populate('owner');
      if (!response.wiki) {
        throw 'notFound';
      }
    } else {
      var wikis = await Wiki.find({
        where: { concept: 1, deleted: false },
        sort: 'id ASC',
        limit: 1,
        skip: 0,
      })
        .populate('tags', {
          sort: 'name',
        })
        .populate('owner');
      if (wikis.length < 1) {
        throw 'notFound';
      }
      response.wiki = wikis[0];
    }

    var updated = await Wiki.updateOne({
      id: response.wiki.id,
    }).set({ accessCount: response.wiki.accessCount + 1 });
    if (!updated) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.wiki.owner, 36);

    response.wiki.items = await WikiItem.find({
      where: {
        wiki: response.wiki.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');

    return response;
  },
};
