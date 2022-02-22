module.exports = {
  friendlyName: 'View wiki',
  description: 'Display "Wiki" page.',
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
      viewTemplatePath: 'pages/wiki/wiki',
    },
    notFound: {
      description: 'The user has accessed a team that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.wiki = await Wiki.findOne({
      no: inputs.no,
      handleId: inputs.handleId,
      concept: 0,
      deleted: false,
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

    var updated = await Wiki.updateOne({
      id: response.wiki.id,
    }).set({ accessCount: response.wiki.accessCount + 1 });
    if (!updated) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.wiki.owner, 36);

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

    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    if (this.req.session.errorMessage) {
      response.errorMessage = this.req.session.errorMessage;
      delete this.req.session.errorMessage;
    }

    return await sails.helpers.compact(response);
  },
};
