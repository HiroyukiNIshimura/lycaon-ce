module.exports = {
  friendlyName: 'View new organization',

  description: 'Display "New organization" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/entrance/new-organization',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function () {
    if (this.req.organization && this.req.organization.isBackOffice) {
      return { isBackOffice: true };
    } else {
      if (!sails.config.custom.useRegistOrganization) {
        throw 'notFound';
      }
    }
    return {};
  },
};
