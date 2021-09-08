module.exports = {
  friendlyName: 'View new wiki(from thread)',

  description: 'Display "New wiki(from thread)" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    thread: {
      type: 'number',
      required: true,
      description: 'thread.no',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/wiki/new-wiki',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.thread = await Thread.findOne({
      no: inputs.thread,
      handleId: inputs.handleId,
    });
    if (!response.thread) {
      throw 'notFound';
    }

    response.team = await sails.helpers.validateMembership.with({
      id: response.thread.team,
      user: this.req.me,
    });
    if (!response.team) {
      throw 'notFound';
    }

    response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');
    response.witeListOfExts = [];
    if (this.req.sysSettings.witeListOfExts) {
      var exts = this.req.sysSettings.witeListOfExts.split(',');
      response.witeListOfExts = exts.map((o) => {
        return '.' + o;
      });
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
