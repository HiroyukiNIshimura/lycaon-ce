/**
 * Team.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'team',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      description: 'チーム名称',
      custom: function (value) {
        return [...value].length <= 100;
      },
      example: 'チームA',
    },
    description: {
      type: 'string',
      description: '説明',
      custom: function (value) {
        return [...value].length <= 500;
      },
      example: 'チームの説明',
    },
    useGit: {
      type: 'boolean',
      description: 'git連携するかどうか',
    },
    gitOrigin: {
      type: 'string',
      description: `The git's branch.`,
      example: 'master',
      defaultsTo: 'master',
    },
    connectType: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '0:basic、1:gitlab',
    },
    gitRepository: {
      type: 'string',
      description: 'githubのリポジトリ',
      example: 'lycaon',
    },
    gitUser: {
      type: 'string',
      description: 'githubのオーナー',
      example: 'foo',
    },
    gitPassword: {
      type: 'string',
      description: 'gitlabのプライベートアクセストークン',
      example: 'password',
    },
    gitlabApi: {
      type: 'string',
      isURL: true,
      description: 'gitlab api url.',
    },
    gitlabToken: {
      type: 'string',
      description: 'gitlab api access token.',
    },
    gitlabProjectId: {
      type: 'string',
      description: 'gitlab project id.',
    },
    defaultConcept: {
      type: 'ref',
      columnType: 'smallint',
      defaultsTo: 1,
      isIn: [0, 1],
      description:
        '新規スレッド作成時デフォルトコンセプト 0:ドラフト（他者に見えるが他者による変更はできない）、1:公開（他者に見えて他者も変更可能）',
      example: 0,
    },
    deleted: {
      type: 'boolean',
      description: '論理削除フラグ',
      example: 'false',
    },
    isSandbox: {
      type: 'boolean',
      description: 'Sandbox',
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
    users: {
      collection: 'user',
      via: 'teams',
    },
    threads: {
      collection: 'thread',
      via: 'team',
    },
    activities: {
      collection: 'threadActivity',
      via: 'team',
    },
    wikis: {
      collection: 'wiki',
      via: 'team',
    },
    emailNoThankYous: {
      collection: 'user',
      via: 'emailNoThankYous',
    },
    gitlogs: {
      collection: 'gitlog',
      via: 'team',
    },
    milestones: {
      collection: 'milestone',
      via: 'team',
    },
    categories: {
      collection: 'category',
      via: 'teams',
    },
  },
};
