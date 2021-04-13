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
    },
    subject: {
      type: 'string',
      required: true,
      description: 'タイトル',
      maxLength: 200,
      example: 'あの問題点について',
    },
    body: {
      type: 'string',
      description: '本文',
      example: 'これはMarkdownのままのデータ',
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
    fans: {
      collection: 'user',
      via: 'wikiflags',
    },
    votes: {
      collection: 'user',
      via: 'wikivotes',
    },
  },
};
