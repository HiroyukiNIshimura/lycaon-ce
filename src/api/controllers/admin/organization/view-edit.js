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
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/organization/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function () {
    var message;
    if (this.req.session.effectMessage) {
      message = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return {
      effectMessage: message,
    };
  },
};
