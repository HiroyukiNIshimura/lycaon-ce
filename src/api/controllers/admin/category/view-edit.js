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
      viewTemplatePath: 'pages/admin/category/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};
    response.category = await Category.findOne({
      id: inputs.id,
      organization: this.req.organization.id,
    });

    if (!response.category) {
      throw 'notFound';
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
