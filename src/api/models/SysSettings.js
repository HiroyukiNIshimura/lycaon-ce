/**
 * SysSettings.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'sys_settings',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    weeklyReportDay: {
      type: 'ref',
      columnType: 'smallint',
      isIn: [0, 1, 2, 3, 4, 5, 6],
      defaultsTo: 1,
      min: 0,
      max: 6,
      isInteger: true,
      description: '週次報告送信曜日',
    },
    maxUploadFileSize: {
      type: 'ref',
      columnType: 'bigint',
      defaultsTo: 1024 * 1024 * 10, //10MB
      description: 'アップロードファイルの最大サイズ',
    },
    witeListOfExts: {
      type: 'string',
      defaultsTo: 'zip,txt,pdf,gif,jpg,jpeg,png,bmp,mp3,mid,wma,wav,avi,wmv,mpg,mp4,docx,xlsx,pptx',
      description: '許可するアップロードファイルの拡張子',
      example: 'png,zip,pdf',
    },
    notMailSend: {
      type: 'boolean',
      description: 'メール配信は行わない',
    },
    notSendBackoffice: {
      type: 'boolean',
      description: '配信不可のメールを管理用メールアドレスに送信しない',
    },
    internalEmailAddress: {
      type: 'string',
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
      description: '管理用メールアドレス',
    },
    fromEmailAddress: {
      type: 'string',
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
      description: '外部に送信するメールのfromアドレス',
    },
    fromName: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '外部に送信するメールのfrom名称',
    },
    workingHoursPerDay: {
      type: 'number',
      defaultsTo: 8,
      isInteger: true,
      max: 24,
      min: 1,
      description: '1日の作業時間',
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
    lastUpdateUser: {
      model: 'user',
    },
  },
};
