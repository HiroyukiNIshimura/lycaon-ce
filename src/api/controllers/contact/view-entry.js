module.exports = {
  friendlyName: 'View entry',

  description: 'Display "Entry" page.',

  inputs: {
    isQuote: {
      type: 'boolean',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/contact/entry',
    },
  },

  fn: async function (inputs) {
    if (this.req.session.inquery) {
      var inquery = this.req.session.inquery;
      delete this.req.session.inquery;
      return {
        formData: inquery,
      };
    }

    if (inputs.isQuote) {
      /**
      以下の配列から見積もりのインデックスをセット
      var categories = [
        'Questions about application',
        'Questions about features',
        'On-premises quote',
        'Inquiries about disabilities',
        'Questions about cancellation',
        'Other',
      ];
       */
      return { formData: { categories: ['2'] } };
    }
    return {};
  },
};
