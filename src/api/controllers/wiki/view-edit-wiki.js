module.exports = {
  friendlyName: 'View edit wiki',

  description: 'Display "Edit wiki" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    no: {
      type: 'number',
      required: true,
      description: 'wiki.no',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/wiki/edit-wiki',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.wiki = await Wiki.findOne({
      no: inputs.no,
      handleId: inputs.handleId,
      concept: 0,
    })
      .populate('tags', {
        sort: 'name',
      })
      .populate('owner')
      .populate('votes')
      .populate('flags', { where: { user: this.req.me.id } });
    if (!response.wiki) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.wiki.owner, 36);

    response.isFan = false;
    if (response.wiki.flags.length > 0) {
      response.isFan = true;
    }

    response.team = await sails.helpers.validateMembership.with({
      id: response.wiki.team,
      user: this.req.me,
    });

    if (!response.team) {
      throw 'notFound';
    }

    response.wiki.items = await WikiItem.find({
      where: {
        wiki: response.wiki.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');
    for (let item of response.wiki.items) {
      await User.setGravatarUrl(item.owner, 36);
    }

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    return await sails.helpers.compact(response);
  },
};
