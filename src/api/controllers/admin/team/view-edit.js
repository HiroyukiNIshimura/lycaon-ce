module.exports = {
  friendlyName: 'View edit',

  description: 'Display "Edit" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },

    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/team/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};
    response.team = await Team.findOne({
      id: inputs.id,
    })
      .populate('users')
      .populate('categories');

    if (!response.team) {
      throw 'notFound';
    }

    response.users = await User.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });
    response.users.push(await User.findOne({ emailAddress: 'lycaonbot@example.com' }));

    response.categories = await Category.find({ organization: this.req.organization.id });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return await sails.helpers.compact(response);
  },
};
