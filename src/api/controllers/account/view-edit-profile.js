module.exports = {
  friendlyName: 'View edit profile',

  description: 'Display "Edit profile" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/account/edit-profile',
    },
  },

  fn: async function () {
    var user = await User.findOne({ id: this.req.me.id })
      .populate('teams')
      .populate('emailNoThankYous')
      .populate('sendMailTags')
      .populate('sendMailCategories');

    var locales = [];
    for (let item of sails.config.i18n.locales) {
      locales.push({
        key: item,
        text: sails.__(item),
      });
    }

    var tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    var categories = await Category.find({ organization: this.req.organization.id }).sort('name ASC');

    var messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    return {
      teams: await sails.helpers.compact(user.teams),
      emailNoThankYous: user.emailNoThankYous,
      tags: tags,
      sendMailTags: user.sendMailTags,
      categories: categories,
      sendMailCategories: user.sendMailCategories,
      locales: locales,
      messageStack: messageStack,
    };
  },
};
