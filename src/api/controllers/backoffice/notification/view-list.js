module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',

  inputs: {
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/notification/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.adminGridRowPerPage,
    });
    response.pagination = pagination;

    response.records = await SysNotification.count();
    response.notifications = await SysNotification.find({
      sort: [{ postingAt: 'DESC' }, { id: 'DESC' }],
      limit: pagination.limit,
      skip: pagination.skip,
    });

    for (let entity of response.notifications) {
      //
      var qty = await sails.models['sysnotification_users__user_sysnotifications'].count({
        sysnotification_users: entity.id,
      });

      entity.notReadQty = qty;
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
