module.exports = {
  friendlyName: 'View edit',

  description: 'Display "Edit" page.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'wiki.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/pubdoc/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.wiki = await Wiki.findOne({
      id: inputs.id,
      concept: 1,
    })
      .populate('tags', {
        sort: 'name',
      })
      .populate('owner');
    if (!response.wiki) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.wiki.owner, 36);

    response.wiki.items = await WikiItem.find({
      where: {
        wiki: response.wiki.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');
    for (let item of response.wiki.items) {
      await User.setGravatarUrl(item.owner, 36);
    }

    response.tags = await Tag.find().sort('name ASC');
    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
