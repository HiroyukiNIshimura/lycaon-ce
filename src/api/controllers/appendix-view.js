const path = require('path'),
  fs = require('fs');

/**
 * 本当は、itemのidをパラメータにするのが美しいしセキュアだが
 * itemを作成するまでidがわからないのでitemに保存するパスにidを含められない。
 * ということで物理ファイル名を元にイメージパスを構築している
 */
module.exports = {
  friendlyName: 'View Appendix',
  description: 'View the Appendix for the logged-in user.',
  inputs: {
    type: {
      type: 'string',
      isIn: ['thread', 'wiki', 'vote'],
      required: true,
    },
    size: {
      type: 'string',
      isIn: ['L', 'M', 'S'],
      defaultsTo: 'M',
    },
    id: {
      type: 'number',
      required: true,
    },
    fileId: {
      type: 'string',
      required: true,
    },
    ext: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'View Appendix successfully.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var target = '';

    if (inputs.type === 'thread') {
      var thread = await Thread.findOne({
        id: inputs.id,
      });
      if (!thread) {
        throw 'notFound';
      }

      var team = await Team.findOne({
        id: thread.team,
      }).populate('users', {
        where: {
          id: this.req.me.id,
        },
      });
      if (team.users.length < 1) {
        throw 'notFound';
      }

      if (inputs.size === 'L') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'thread',
          String(inputs.id),
          inputs.fileId
        );
      } else if (inputs.size === 'S') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'thread',
          String(inputs.id),
          'thum_s',
          inputs.fileId
        );
      } else {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'thread',
          String(inputs.id),
          'thum_m',
          inputs.fileId
        );
      }
    } else if (inputs.type === 'wiki') {
      var wiki = await Wiki.findOne({
        id: inputs.id,
        concept: 0,
        deleted: false,
      });
      if (!wiki) {
        throw 'notFound';
      }

      var team = await Team.findOne({
        id: wiki.team,
      }).populate('users', {
        where: {
          id: this.req.me.id,
        },
      });
      if (team.users.length < 1) {
        throw 'notFound';
      }

      if (inputs.size === 'L') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'wiki',
          String(inputs.id),
          inputs.fileId
        );
      } else if (inputs.size === 'S') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'wiki',
          String(inputs.id),
          'thum_s',
          inputs.fileId
        );
      } else {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'wiki',
          String(inputs.id),
          'thum_m',
          inputs.fileId
        );
      }
    } else {
      var vote = await Vote.findOne({
        id: inputs.id,
      });
      if (!vote) {
        throw 'notFound';
      }

      if (this.req.me.organization.id !== vote.organization) {
        throw 'notFound';
      }

      if (inputs.size === 'L') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'vote',
          String(inputs.id),
          inputs.fileId
        );
      } else if (inputs.size === 'S') {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'vote',
          String(inputs.id),
          'thum_s',
          inputs.fileId
        );
      } else {
        target = path.resolve(
          sails.config.appPath,
          'appendix',
          'vote',
          String(inputs.id),
          'thum_m',
          inputs.fileId
        );
      }
    }

    if (inputs.ext) {
      target = target + '.' + inputs.ext;
    }

    if (!fs.existsSync(target)) {
      throw 'notFound';
    }

    try {
      return fs.createReadStream(target);
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
