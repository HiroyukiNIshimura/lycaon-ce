/**
 * VoteItem.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'vote_item',
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
      example: 'appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualPathMid: {
      type: 'string',
      required: true,
      unique: true,
      description:
        'ファイル格納場所からの相対的仮想パス。OSのパスにセパレーターに準じる。ファイル名はハッシュ文字列',
      example: 'appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualPathSmall: {
      type: 'string',
      required: true,
      unique: true,
      description:
        'ファイル格納場所からの相対的仮想パス。OSのパスにセパレーターに準じる。ファイル名はハッシュ文字列',
      example: 'appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e.jpeg',
    },
    virtualUrl: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
    },
    virtualUrlMid: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
    },
    virtualUrlSmall: {
      type: 'string',
      required: true,
      unique: true,
      description: 'ファイルにアクセスするための仮想URL',
      example: '/appendix/vote/1/ad1f1a52-b42a-47b4-9e03-c570bd7d558e/jpeg',
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
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    vote: {
      model: 'vote',
    },
    owner: {
      model: 'user',
    },
  },
};
