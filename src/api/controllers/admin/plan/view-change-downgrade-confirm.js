module.exports = {
  friendlyName: 'View change downgrade confirm',

  description: 'Display "Change downgrade confirm" page.',

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
      viewTemplatePath: 'pages/admin/plan/change-downgrade-confirm',
    },
  },

  fn: async function (inputs) {
    // Respond with view.
    return { plan: inputs.plan };
  },
};
