/**
 * ThreadActivity.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'thread_activity',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    type: {
      type: 'string',
      required: true,
      description: `アクティビティの種類
            see also: helpers/create-thread-activity.js
            `,
      example: 'attach-file',
    },
    stateWord: {
      type: 'string',
    },
    userName: {
      type: 'string',
    },
    fileName: {
      type: 'string',
    },
    targetDate: {
      type: 'ref',
      columnType: 'bigint',
    },
    rawData: {
      type: 'string',
      description:
        'コメント、リプなどのデータをログ的に保存しておく。あくまで誹謗中傷などコンセンサスに問題があったときに調査するためのものでこの内容を表示する機能は設けない。',
    },
    userAgent: {
      type: 'string',
      description:
        'コメント、リプなどのデータをログ的に保存しておく。あくまで誹謗中傷などコンセンサスに問題があったときに調査するためのものでこの内容を表示する機能は設けない。',
    },
    clientIp: {
      type: 'string',
      description:
        'コメント、リプなどのデータをログ的に保存しておく。あくまで誹謗中傷などコンセンサスに問題があったときに調査するためのものでこの内容を表示する機能は設けない。',
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
    thread: {
      model: 'thread',
    },
    user: {
      model: 'user',
    },
    sneeze: {
      model: 'sneeze',
    },
    reply: {
      model: 'reply',
    },
  },
};
