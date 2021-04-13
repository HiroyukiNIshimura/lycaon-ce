module.exports = {
  friendlyName: 'View edit',

  description: 'Display "Edit" page.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'notification.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/notification/edit',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a notification that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.notification = await SysNotification.findOne({ id: inputs.id });
    if (!response.notification) {
      throw 'notFound';
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
