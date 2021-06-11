module.exports = {
  friendlyName: 'View snippets',

  description: 'Display "Snippets" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/snippets',
    },
    notFound: {
      responseType: 'notfound',
      description: 'Snippets are only valid during development.',
    },
  },

  fn: async function () {
    if (process.env.NODE_ENV === 'production') {
      throw 'notFound';
    }
    return {};
  },
};
