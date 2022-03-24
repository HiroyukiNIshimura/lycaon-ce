/**
 * Wiki.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'wiki',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    no: {
      type: 'number',
      required: true,
    },
    handleId: {
      type: 'string',
      required: true,
      description: 'organization.handleId',
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
    },
    subject: {
      type: 'string',
      required: true,
      description: 'タイトル',
      custom: function (value) {
        return [...value].length <= 200;
      },
      example: 'あの問題点について',
    },
    body: {
      type: 'string',
      custom: function (value) {
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      description: '本文',
      example: 'これはMarkdownのままのデータ',
    },
    previous: {
      type: 'string',
      description: '一世代前の本文との差分',
      example: 'これはJSONデータ',
    },
    concept: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '0:ログインユーザーのみ閲覧可能、1:グローバルに公開',
      example: 0,
    },
    tagToken: {
      type: 'string',
      description: 'tag検索用トークン',
      example: '1:2:13:',
    },
    accessCount: {
      type: 'number',
      defaultsTo: 0,
      description: '単純な閲覧回数',
    },
    nice: {
      type: 'number',
      defaultsTo: 0,
      description: 'いいね',
      example: 1,
    },
    deleted: {
      type: 'boolean',
      description: '論理削除フラグ',
      example: 'false',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    team: {
      model: 'team',
    },
    tags: {
      collection: 'tag',
      via: 'wikis',
    },
    owner: {
      model: 'user',
    },
    lastUpdateUser: {
      model: 'user',
    },
    items: {
      collection: 'wikiItem',
      via: 'wiki',
    },
    flags: {
      collection: 'wikiFlag',
      via: 'wiki',
    },
    votes: {
      collection: 'user',
      via: 'wikivotes',
    },
  },
};
