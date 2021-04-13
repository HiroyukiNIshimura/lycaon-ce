const path = require('path'),
  fs = require('fs');

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
    var target = '';

    var wiki = await Wiki.findOne({
      id: inputs.id,
      concept: 1,
      deleted: false,
    });
    if (!wiki) {
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

    if (inputs.ext) {
      target = target + '.' + inputs.ext;
    }

    try {
      return fs.createReadStream(target);
    } catch (err) {
      sails.log.error(err);
      throw 'notFound';
    }
  },
};
