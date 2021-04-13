/**
 * Organization.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'organization',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    handleId: {
      type: 'string',
      required: true,
      unique: true,
      description: '組織ID',
      maxLength: 10,
      example: 'BL',
    },
    name: {
      type: 'string',
      required: true,
      description: '組織名',
      maxLength: 100,
      example: 'ブライト・エル',
    },
    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 300,
      description: '代表者メールアドレス',
      example: 'mary.sue@example.com',
    },
    fullName: {
      type: 'string',
      required: true,
      maxLength: 120,
      description: '代表者氏名',
      example: 'Mary Sue van der McHenst',
    },
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
      defaultsTo: 'free',
      description: 'プラン',
    },
    deleted: {
      type: 'boolean',
      description: '論理削除フラグ',
      example: 'false',
    },
    isBackOffice: {
      type: 'boolean',
      description: '特権組織',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    users: {
      collection: 'user',
      via: 'organization',
    },
    teams: {
      collection: 'team',
      via: 'organization',
    },
    tags: {
      collection: 'tag',
      via: 'organization',
    },
    categories: {
      collection: 'category',
      via: 'organization',
    },
  },
};
