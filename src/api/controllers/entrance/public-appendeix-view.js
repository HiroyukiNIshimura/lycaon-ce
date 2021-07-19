const path = require('path');
const fs = require('fs');

/**
 * 本当は、itemのidをパラメータにするのが美しいしセキュアだが
 * itemを作成するまでidがわからないのでitemに保存するパスにidを含められない。
 * ということで物理ファイル名を元にイメージパスを構築している
 */
module.exports = {
  friendlyName: 'View public wiki appendix',
  description: 'View the public wiki appendix for the not-logged-in user.',
  inputs: {
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
    var wiki = await Wiki.findOne({
      id: inputs.id,
      concept: 1,
      deleted: false,
    });
    if (!wiki) {
      throw 'notFound';
    }

    var getPath = function (size, id, fileId, ext) {
      let target = path.resolve(sails.config.appPath, 'appendix', 'wiki', String(id), fileId);
      if (size === 'M') {
        target = path.resolve(sails.config.appPath, 'appendix', 'wiki', String(id), 'thum_m', fileId);
      }
      if (size === 'S') {
        target = path.resolve(sails.config.appPath, 'appendix', 'wiki', String(id), 'thum_s', fileId);
      }
      if (ext) {
        target = target + '.' + ext;
      }
      return target;
    };

    var target = getPath(inputs.size, inputs.id, inputs.fileId, inputs.ext);

    if (!fs.existsSync(target)) {
      target = getPath('L', inputs.id, inputs.fileId, inputs.ext);
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
