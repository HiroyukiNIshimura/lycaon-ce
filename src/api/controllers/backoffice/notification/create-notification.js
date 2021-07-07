module.exports = {
  friendlyName: 'create notification',

  description: 'create notification.',

  inputs: {
    subject: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    body: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 107374180;
      },
      required: true,
    },
    postingAt: {
      type: 'number',
      required: true,
    },
    category: {
      type: 'string',
      isIn: ['notice', 'important', 'maintenance'],
      defaultsTo: 'notice',
    },
    deleted: {
      type: 'boolean',
    },
  },

  exits: {
    success: {},
  },

  fn: async function (inputs) {
    var created = {};

    var NATIVE_SQL = `INSERT INTO "sysnotification_users__user_sysNotifications" ("id", "user_sysNotifications", "sysnotification_users") SELECT nextval('"sysnotification_users__user_sysNotifications_id_seq"'), "id", $1 FROM "user" WHERE "isNologin" = false AND "deleted" = false`;

    try {
      var valuesToSet = _.extend({}, inputs);

      await sails.getDatastore().transaction(async (db) => {
        created = await SysNotification.create(valuesToSet).fetch().usingConnection(db);

        await sails.sendNativeQuery(NATIVE_SQL, [created.id]).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Created a system notification');

    return { id: created.id };
  },
};
