module.exports = {
  friendlyName: 'View create',

  description: 'Display "Create" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/pubdoc/create',
    },
  },

  fn: async function () {
    var response = {};

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    return response;
  },
};
