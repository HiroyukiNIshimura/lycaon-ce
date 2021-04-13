module.exports = {
  friendlyName: 'View edit password',

  description: 'Display "Edit password" page.',

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
      viewTemplatePath: 'pages/account/edit-password',
    },
  },

  fn: async function () {
    var messageStack = await sails.helpers.findMessage.with({ me: this.req.me });
    return { messageStack: messageStack };
  },
};
