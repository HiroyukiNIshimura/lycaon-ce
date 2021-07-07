/**
 * Milestone.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'milestone',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      description: 'マイルストーン名称',
      custom: function (value) {
        return [...value].length <= 20;
      },
      example: '設計',
    },
    lineNo: {
      type: 'number',
      required: true,
      description: 'ガントチャートでの表示順',
      example: '1',
    },
    startAt: {
      type: 'ref',
      columnType: 'bigint',
      description: '開始日',
    },
    duration: {
      type: 'ref',
      columnType: 'bigint',
      description: '期間',
    },
    progress: {
      type: 'number',
      defaultsTo: 0,
      description: '進捗率（％）',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    user: {
      model: 'user',
    },
    team: {
      model: 'team',
    },
    threads: {
      collection: 'thread',
      via: 'milestone',
    },
  },
};
