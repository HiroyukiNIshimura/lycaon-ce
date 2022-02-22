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
      viewTemplatePath: 'pages/admin/user/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};
    response.user = await User.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    }).populate('teams');

    if (!response.user) {
      throw 'notFound';
    }

    response.teams = await Team.find().where({
      deleted: false,
      organization: this.req.organization.id,
    });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return await sails.helpers.compact(response);
  },
};
