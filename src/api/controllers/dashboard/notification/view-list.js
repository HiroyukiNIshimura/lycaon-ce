module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/notification/list',
    },
  },

  fn: async function () {
    var response = {};

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
