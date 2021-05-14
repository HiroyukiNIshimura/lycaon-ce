/**
 * ThreadItem.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'thread_item',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      description: 'ファイル名',
      maxLength: 200,
      example: 'abd.pdf',
    },
    virtualPath: {
      type: 'string',
      required: true,
      unique: true,
      description:
        'ファイル格納場所からの相対的仮想パス。OSのパスにセパレーターに準じる。ファイル名はハッシュ文字列',
      example: 'appendix/thread/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualPathMid: {
      type: 'string',
      required: true,
      unique: true,
      description:
        'ファイル格納場所からの相対的仮想パス。OSのパスにセパレーターに準じる。ファイル名はハッシュ文字列',
      example: 'appendix/wiki/1/thum_m/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualPathSmall: {
      type: 'string',
      required: true,
      unique: true,
      description:
        'ファイル格納場所からの相対的仮想パス。OSのパスにセパレーターに準じる。ファイル名はハッシュ文字列',
      example: 'appendix/wiki/1/thum_s/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualUrl: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/thread/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
    },
    virtualUrlMid: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/wiki/1/thum_m/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
    },
    virtualUrlSmall: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/wiki/1/thum_s/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
    },
    hashName: {
      type: 'string',
      description: 'ファイルに付与されたハッシュID',
    },
    size: {
      type: 'number',
      defaultsTo: 0,
      description: 'ファイルサイズ',
      example: '12345',
    },
    mimeType: {
      type: 'string',
      description: 'ファイルのMimeType',
      example: 'application/pdf',
    },
    qWords: {
      type: 'string',
      description: '検索用わかちデータ',
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    thread: {
      model: 'thread',
    },
    owner: {
      model: 'user',
    },
  },
  customToJSON: function () {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['qWords']);
  },
};
