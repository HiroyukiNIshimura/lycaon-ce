module.exports = {
  friendlyName: 'View complete',

  description: 'Display "Complete" page.',

  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'pages/contact/complete',
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
    delete this.req.session.inquery;

    if (!this.req.session.captchaToken) {
      throw 'notFound';
    }
    delete this.req.session.captchaToken;

    return {};
  },
};
