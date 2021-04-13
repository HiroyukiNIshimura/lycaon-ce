module.exports = {
  friendlyName: 'View change upgrade confirm',

  description: 'Display "Change upgrade confirm" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/plan/change-upgrade-confirm',
    },
  },

  fn: async function (inputs) {
    // Respond with view.
    return { plan: inputs.plan };
  },
};
