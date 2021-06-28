module.exports = {
  friendlyName: 'View view',

  description: 'Display "View" page.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'notification.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/notification/view',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a notification that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var dt = new Date();
    dt.setDate(dt.getDate() + 1);
    dt.setHours(0, 0, 0, 0);

    var notification = await SysNotification.findOne({
      id: inputs.id,
      deleted: false,
      postingAt: { '<': dt.valueOf() },
    });
    if (!notification) {
      throw 'notFound';
    }

    var result = await SysNotification.find({
      where: {
        deleted: false,
        postingAt: { '<': notification.postingAt },
        // eslint-disable-next-line no-dupe-keys
        postingAt: { '<': dt.valueOf() },
        id: { '<': notification.id },
      },
      sort: [{ postingAt: 'DESC' }, { id: 'DESC' }],
      limit: 1,
    });

    if (result.length > 0) {
      response.before = result[0].id;
    }

    result = await SysNotification.find({
      where: {
        deleted: false,
        postingAt: { '>': notification.postingAt },
        // eslint-disable-next-line no-dupe-keys
        postingAt: { '<': dt.valueOf() },
        id: { '>': notification.id },
      },
      sort: [{ postingAt: 'ASC' }, { id: 'ASC' }],
      limit: 1,
    });

    if (result.length > 0) {
      response.after = result[0].id;
    }

    //未読レコードを消す
    try {
      await sails.getDatastore().transaction(async (db) => {
        await sails.models['sysnotification_users__user_sysnotifications']
          .destroyOne({
            // eslint-disable-next-line camelcase
            sysnotification_users: notification.id,
            // eslint-disable-next-line camelcase
            user_sysNotifications: this.req.me.id,
          })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    response.notification = notification;

    return response;
  },
};
