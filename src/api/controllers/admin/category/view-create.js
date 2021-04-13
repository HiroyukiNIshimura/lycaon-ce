module.exports = {
  friendlyName: 'View create',

  description: 'Display "Create" page.',

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
      viewTemplatePath: 'pages/admin/category/create',
    },
  },

  fn: async function () {
    // Respond with view.
    return {};
  },
};
