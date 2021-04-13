module.exports = {
  friendlyName: 'View edit',

  description: 'Display "Edit" page.',

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
      viewTemplatePath: 'pages/admin/settings/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function () {
    var entity = await SysSettings.findOne({ organization: this.req.organization.id });
    if (!entity) {
      throw 'notFound';
    }

    var message;
    if (this.req.session.effectMessage) {
      message = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return {
      sysSettings: entity,
      witeListOfExts: sails.config.custom.witeListOfExts, //デフォルトの許可する拡張子なので設定から取得
      effectMessage: message,
    };
  },
};
