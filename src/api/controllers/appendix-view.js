const path = require('path');
const fs = require('fs');

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
    var team = {};

    var getPath = function (size, type, id, fileId, ext) {
      var hostid = process.env.HOSTING_URL;
      if (!hostid) {
        hostid = 'localhost';
      }

      let target = path.resolve(sails.config.appPath, 'appendix', hostid, type, String(id), fileId);
      if (size === 'M') {
        target = path.resolve(sails.config.appPath, 'appendix', hostid, type, String(id), 'thum_m', fileId);
      }
      if (size === 'S') {
        target = path.resolve(sails.config.appPath, 'appendix', hostid, type, String(id), 'thum_s', fileId);
      }
      if (ext) {
        target = target + '.' + ext;
      }
      return target;
    };

    if (inputs.type === 'thread') {
      var thread = await Thread.findOne({
        id: inputs.id,
      });
      if (!thread) {
        throw 'notFound';
      }

      team = await Team.findOne({
        id: thread.team,
      }).populate('users', {
        where: {
          id: this.req.me.id,
        },
      });
      if (team.users.length < 1) {
        throw 'notFound';
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

      team = await Team.findOne({
        id: wiki.team,
      }).populate('users', {
        where: {
          id: this.req.me.id,
        },
      });
      if (team.users.length < 1) {
        throw 'notFound';
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
    }

    var target = getPath(inputs.size, inputs.type, inputs.id, inputs.fileId, inputs.ext);

    if (!fs.existsSync(target)) {
      target = getPath('L', inputs.type, inputs.id, inputs.fileId, inputs.ext);
      if (!fs.existsSync(target)) {
        throw 'notFound';
      }
    }

    try {
      return fs.createReadStream(target);
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
