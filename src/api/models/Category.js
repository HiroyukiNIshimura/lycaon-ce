/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'category',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      description: 'カテゴリ名称',
      custom: function (value) {
        return [...value].length <= 10;
      },
      example: '課題',
    },
    displayOrder: {
      type: 'number',
      required: true,
      description: '表示順',
      example: '1',
    },
    useTemplate: {
      type: 'boolean',
      description: 'テンプレートを利用する',
      example: 'true',
    },
    templateSubject: {
      type: 'string',
      description: '件名のテンプレート',
      custom: function (value) {
        return [...value].length <= 200;
      },
      example: '【課題】○○○○○',
    },
    templateBody: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 2000000;
      },
      description: '本文のテンプレートMarkdown',
      example: '# 課題○○○○○',
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
    threads: {
      collection: 'thread',
      via: 'category',
    },
    teams: {
      collection: 'team',
      via: 'categories',
    },
    users: {
      collection: 'user',
      via: 'sendMailCategories',
    },
  },
};
