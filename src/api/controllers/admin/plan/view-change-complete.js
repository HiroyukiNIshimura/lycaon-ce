module.exports = {
  friendlyName: 'View change complete',

  description: 'Display "Change complete" page.',

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
      viewTemplatePath: 'pages/admin/plan/change-complete',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a billing that has not joined.',
    },
  },

  fn: async function () {
    var billing = await Billing.findOne({ organization: this.req.organization.id });
    if (!billing) {
      throw 'notFound';
    }

    if (!this.req.session.planChange) {
      throw 'notFound';
    }
    delete this.req.session.planChange;

    return {};
  },
};
