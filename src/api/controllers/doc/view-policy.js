module.exports = {
  friendlyName: 'View policy',

  description: 'Display "Policy" page.',

  inputs: {
    tab: {
      type: 'string',
      isIn: ['user', 'privacy'],
      defaultsTo: 'user',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/doc/policy',
    },
  },

  fn: async function (inputs) {
    this.res.policy = await Policy.findOne({ id: 1 });
    return {
      tab: inputs.tab,
      userAt: this.res.policy.userAt,
      privacyAt: this.res.policy.privacyAt,
    };
  },
};
