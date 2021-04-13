/**
 * Thread.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'thread',
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
      description: '主題',
      maxLength: 200,
      example: 'あの問題点について',
    },
    body: {
      type: 'string',
      description: '本文',
      example: 'これはMarkdownのままのデータ',
    },
    local: {
      type: 'boolean',
      description: '自分だけのスレッド。他者には見えない。trueの場合はコンセプトは変更できない。',
      example: true,
    },
    concept: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 0,
      isIn: [0, 1],
      description:
        '0:ドラフト（他者に見えるが他者による変更はできない）、1:公開（他者に見えて他者も変更可能）',
      example: 0,
    },
    status: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '状態。0:オープン、1:クローズ',
      example: 0,
    },
    responsibleAt: {
      type: 'ref',
      columnType: 'bigint',
      description: '担当者が設定、変更された日',
      example: 1502844074211,
    },
    tagToken: {
      type: 'string',
      description: 'tag検索用トークン',
      example: '1:2:13:',
    },
    dueDateAt: {
      type: 'ref',
      columnType: 'bigint',
      description: '期限日',
      example: 1502844074211,
    },
    priority: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 1,
      isIn: [0, 1, 2],
      description: '重要度、0:低、1:普通、2:高',
      example: 0,
    },
    urgency: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 0,
      isIn: [0, 1, 2, 3, 4, 5, 6],
      description: '緊急度、0:低 < 6:高',
      example: 0,
    },
    working: {
      type: 'boolean',
      description: '作業中',
      example: 'true',
    },
    accessCount: {
      type: 'number',
      defaultsTo: 0,
    },
    locked: {
      type: 'boolean',
      description: '書き込み禁止',
      example: 'true',
    },
    emotional: {
      type: 'string',
      description: 'エモーショナル判定結果（JSON文字列）',
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
    milestone: {
      model: 'milestone',
    },
    sneezes: {
      collection: 'sneeze',
      via: 'thread',
    },
    replys: {
      collection: 'reply',
      via: 'thread',
    },
    tags: {
      collection: 'tag',
      via: 'threads',
    },
    category: {
      model: 'category',
    },
    owner: {
      model: 'user',
    },
    responsible: {
      model: 'user',
    },
    workingUser: {
      model: 'user',
    },
    lastUpdateUser: {
      model: 'user',
    },
    items: {
      collection: 'threadItem',
      via: 'thread',
    },
    activities: {
      collection: 'threadActivity',
      via: 'thread',
    },
    parent: {
      model: 'thread',
    },
    fans: {
      collection: 'user',
      via: 'flags',
    },
  },
};
