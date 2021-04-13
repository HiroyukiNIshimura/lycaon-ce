module.exports = {
  friendlyName: 'View confirm',

  description: 'Display "Confirm" page.',

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: 'pages/contact/confirm',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a inquery that has not joined.',
    },
  },

  fn: async function () {
    if (!this.req.session.inquery) {
      throw 'notFound';
    }

    var inquery = this.req.session.inquery;
    return { formData: inquery };
  },
};
