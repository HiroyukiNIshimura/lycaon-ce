/**
 * Sneeze.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'sneeze',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    comment: {
      type: 'string',
      required: true,
      description: 'コメント',
      example: 'これはMarkdownのままのデータ',
    },
    deleted: {
      type: 'boolean',
      description: '論理削除フラグ',
      example: 'false',
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
    thread: {
      model: 'thread',
    },
    owner: {
      model: 'user',
    },
    replys: {
      collection: 'reply',
      via: 'sneeze',
    },
    activities: {
      collection: 'threadActivity',
      via: 'sneeze',
    },
  },
};
