module.exports = {
  friendlyName: 'View change',

  description: 'Display "Change" page.',

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
      viewTemplatePath: 'pages/admin/plan/change',
    },
  },

  fn: async function () {
    // Respond with view.
    return { plans: sails.config.custom.plans };
  },
};
