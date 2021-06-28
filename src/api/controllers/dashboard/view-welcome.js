module.exports = {
  friendlyName: 'View welcome',

  description: 'Display "Welcome" page.',

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
      viewTemplatePath: 'pages/dashboard/welcome',
    },
  },

  fn: async function () {
    return {};
  },
};
