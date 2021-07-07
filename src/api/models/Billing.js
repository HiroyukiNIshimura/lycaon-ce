/**
 * Billing.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'billing',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    customerName: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '請求先名称',
    },
    zipCode: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 8;
      },
      description: '郵便番号',
      example: '123-1234',
    },
    prefecture: {
      type: 'string',
      isIn: [
        '',
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県',
      ],
      defaultsTo: '',
      description: '都道府県',
      example: '東京都',
    },
    city: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '市区町村',
    },
    street: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '番地など',
    },
    building: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '建物など',
    },
    phoneNo: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 20;
      },
      description: '電話番号',
      example: '03-1234-1234 | 0312341234 ',
    },
    planChangeAt: {
      type: 'ref',
      columnType: 'bigint',
      description: 'プラン変更依頼が実行された日',
      example: 1502844074211,
    },
    unsubscribedAt: {
      type: 'ref',
      columnType: 'bigint',
      description: '退会依頼が実行された日',
      example: 1502844074211,
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
  },
};
