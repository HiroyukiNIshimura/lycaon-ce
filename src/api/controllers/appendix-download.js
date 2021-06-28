const path = require('path');

module.exports = {
  friendlyName: 'Download Appendix',
  description: 'Download the Appendix for the logged-in user.',
  inputs: {
    type: {
      type: 'string',
      isIn: ['thread', 'wiki', 'vote'],
      required: true,
    },
    id: {
      type: 'number',
      required: true,
    },
    fileId: {
      type: 'string',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'View Appendix successfully.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a item that has not joined.',
    },
  },

  fn: async function (inputs) {
    var user = await User.findOne({
      id: this.req.me.id,
    });
    if (!user) {
      throw 'notFound';
    }

    var item = {};
    var team = {};

    if (inputs.type === 'thread') {
      var thread = await Thread.findOne({
        id: inputs.id,
      });
      if (!thread) {
        throw 'notFound';
      }

      team = await sails.helpers.validateMembership.with({
        id: thread.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }

      item = await ThreadItem.findOne({
        id: inputs.fileId,
      });
    } else if (inputs.type === 'wiki') {
      var wiki = await Wiki.findOne({
        id: inputs.id,
      });
      if (!wiki) {
        throw 'notFound';
      }

      if (wiki.concept === 0) {
        team = await sails.helpers.validateMembership.with({
          id: wiki.team,
          user: this.req.me,
        });
        if (!team) {
          throw 'notFound';
        }
      }

      item = await WikiItem.findOne({
        id: inputs.fileId,
      });
    } else {
      var vote = await Vote.findOne({
        id: inputs.id,
      });
      if (!vote) {
        throw 'notFound';
      }

      if (user.organization !== vote.organization) {
        throw 'notFound';
      }

      item = await VoteItem.findOne({
        id: inputs.fileId,
      });
    }

    if (!item) {
      throw 'notFound';
    }

    var target = path.resolve(sails.config.appPath, item.virtualPath);

    try {
      this.res.attachment(item.name);
      var downloading = await sails.startDownload(target);
      return downloading;
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
