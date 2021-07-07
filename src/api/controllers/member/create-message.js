const moment = require('moment');

module.exports = {
  friendlyName: 'Create messages',

  description: 'Create messages.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'user.id',
    },
    contents: {
      type: 'string',
      required: true,
      custom: function (value) {
        return [...value].length <= 2000;
      },
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a user that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (inputs.id === this.req.me.id) {
      return {};
    }

    var user = await User.findOne({ id: inputs.id, deleted: false });
    if (!user) {
      throw 'notFound';
    }
    if (user.organization !== this.req.me.organization.id) {
      throw 'notFound';
    }

    var valueSet = {
      contents: inputs.contents,
      sendTo: user.id,
      sendFrom: this.req.me.id,
      organization: this.req.me.organization.id,
    };

    var created = {};
    await sails.getDatastore().transaction(async (db) => {
      created = await Message.create(valueSet).fetch().usingConnection(db);
    });

    created.sendFrom = this.req.me;

    var rooms = [`room-${this.req.organization.id}-lycaon`];

    var message = {
      key: 'Received a new message from {0}',
      params: [this.req.me.fullName],
    };

    sails.sockets.broadcast(rooms, 'message-notify', {
      message: message,
      data: created,
      timespan: created.createdAt,
    });

    var templateData = {
      user: this.req.me,
      organization: this.req.organization,
      postedAt: moment(Number(created.createdAt)).format('llll') + ' <JST>',
      locale: user.languagePreference,
    };

    var current = sails.hooks.i18n.getLocale();

    var settings = await SysSettings.findOne({ organization: this.req.organization.id });

    moment.locale(user.languagePreference);
    sails.hooks.i18n.setLocale(user.languagePreference);
    await sails.helpers.sendTemplateEmail.with({
      organization: this.req.organization,
      to: user.emailAddress,
      subject: sails.__('Notification of message reception from {0}').format(this.req.me.fullName),
      fromName: settings.fromName,
      template: 'email-message-notify',
      templateData: templateData,
    });

    sails.hooks.i18n.setLocale(current);
    moment.locale(current);

    return {};
  },
};
