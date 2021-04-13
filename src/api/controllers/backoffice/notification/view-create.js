module.exports = {
  friendlyName: 'View create',

  description: 'Display "Create" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/notification/create',
    },
  },

  fn: async function () {
    // Respond with view.
    return {};
  },
};
