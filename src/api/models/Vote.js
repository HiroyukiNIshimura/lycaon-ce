/**
 * Vote.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'vote',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    subject: {
      type: 'string',
      required: true,
      description: 'タイトル',
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    body: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      description: '本文',
    },
    previous: {
      type: 'string',
      description: '一世代前の本文との差分',
      example: 'これはJSONデータ',
    },
    isQuestionnaireFormat: {
      type: 'boolean',
      description: 'アンケート形式かどうか',
    },
    question: {
      type: 'string',
      description: '設問',
      custom: function (value) {
        return [...value].length <= 200;
      },
    },
    circulationFrom: {
      type: 'ref',
      columnType: 'bigint',
      required: true,
      description: '回覧期間FROM',
      example: 1502844074211,
    },
    circulationTo: {
      type: 'ref',
      columnType: 'bigint',
      required: true,
      description: '回覧期間To',
      example: 1502844074211,
    },
    multipleAnswers: {
      type: 'boolean',
      description: '回答が複数選択可能かどうか',
    },
    hasOther: {
      type: 'boolean',
      description: '選択肢に「その他」を追加するか',
    },
    mailSended: {
      type: 'boolean',
      description: 'メール通知済み、メール配信が済んだ時点で更新される',
      example: 'false',
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    organization: {
      model: 'organization',
    },
    author: {
      model: 'user',
    },
    users: {
      collection: 'user',
      via: 'votes',
    },
    choices: {
      collection: 'voteChoices',
      via: 'vote',
    },
    answers: {
      collection: 'voteAnswer',
      via: 'vote',
    },
    sneezes: {
      collection: 'voteSneeze',
      via: 'vote',
    },
  },
};
