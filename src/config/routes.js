/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /': {
    action: 'view-homepage-or-redirect',
  },
  'GET /:handleId/welcome': {
    action: 'dashboard/view-welcome',
  },
  'GET /:handleId/main/:page?': {
    action: 'dashboard/view-main',
  },
  'GET /:handleId/team/:id': {
    action: 'dashboard/view-team',
  },
  'GET /:handleId/team/git/:id': {
    action: 'dashboard/git/view-git-show',
  },
  'GET /:handleId/team/:id/git/:sha': {
    action: 'dashboard/git/view-git-show-sha',
  },
  'GET /:handleId/thread/:no': {
    action: 'dashboard/view-thread',
  },
  'GET /:handleId/thread/create/:id/:thread?': {
    action: 'dashboard/view-new-thread',
  },

  //mindmap
  'GET /:handleId/mindmap/:no': {
    action: 'dashboard/view-mindmap',
  },

  //milestone
  'GET /:handleId/milestone/:team': {
    action: 'dashboard/milestone/view-view',
  },
  'GET /:handleId/milestone/create/:team': {
    action: 'dashboard/milestone/view-create',
  },
  'GET /:handleId/milestone/edit/:id': {
    action: 'dashboard/milestone/view-edit',
  },
  'GET /:handleId/milestone/sort/:team': {
    action: 'dashboard/milestone/view-sort',
  },

  //vote
  'GET /:handleId/vote/:id': {
    action: 'dashboard/vote/view-view',
  },
  'GET /:handleId/vote/create': {
    action: 'dashboard/vote/view-create',
  },
  'GET /:handleId/vote/edit/:id': {
    action: 'dashboard/vote/view-edit',
  },
  'GET /:handleId/vote/answer/:id': {
    action: 'dashboard/vote/view-answer',
  },

  'GET /email/confirm': {
    action: 'entrance/confirm-email',
  },
  'GET /email/confirmed': {
    action: 'entrance/view-confirmed-email',
  },
  'GET /login': {
    action: 'entrance/view-login',
  },
  'GET /password/forgot': {
    action: 'entrance/view-forgot-password',
  },
  'GET /password/new-account': {
    action: 'entrance/view-new-account-password',
  },
  'GET /password/new': {
    action: 'entrance/view-new-password',
  },
  'GET /organization/new': {
    action: 'entrance/view-new-organization',
  },
  'GET /notification': {
    action: 'dashboard/notification/view-list',
  },
  'GET /notification/:id': {
    action: 'dashboard/notification/view-view',
  },

  'GET /:handleId/account': {
    action: 'account/view-account-overview',
  },
  'GET /:handleId/account/password': {
    action: 'account/view-edit-password',
  },
  'GET /:handleId/account/profile': {
    action: 'account/view-edit-profile',
  },

  //wiki
  'GET /:handleId/wiki/:no': {
    action: 'wiki/view-wiki',
  },
  'GET /:handleId/wiki/create/:team': {
    action: 'wiki/view-new-wiki',
  },
  'GET /:handleId/wiki/edit/:no': {
    action: 'wiki/view-edit-wiki',
  },
  'GET /:handleId/wiki/convert/:thread': {
    action: 'wiki/view-convert-wiki',
  },

  //member
  'GET /:handleId/member/:id': {
    action: 'member/view-info',
  },

  //admin
  'GET /:handleId/admin/users/:page?': {
    action: 'admin/user/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/user/edit/:id': {
    action: 'admin/user/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/user/create': {
    action: 'admin/user/view-create',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/categories': {
    action: 'admin/category/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/category/edit/:id': {
    action: 'admin/category/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/category/create': {
    action: 'admin/category/view-create',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/teams/:page?': {
    action: 'admin/team/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/team/edit/:id': {
    action: 'admin/team/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/team/create': {
    action: 'admin/team/view-create',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/wikis/:page?': {
    action: 'admin/wiki/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/settings': {
    action: 'admin/settings/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan': {
    action: 'admin/plan/view-info',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/unsubscribed': {
    action: 'admin/plan/view-unsubscribed',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/unsubscribed/complete': {
    action: 'admin/plan/view-unsubscribed-complete',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/change': {
    action: 'admin/plan/view-change',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/change/upgrade/:plan': {
    action: 'admin/plan/view-change-upgrade-confirm',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/change/downgrade/:plan': {
    action: 'admin/plan/view-change-downgrade-confirm',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /:handleId/admin/plan/change/complete': {
    action: 'admin/plan/view-change-complete',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },

  //backoffice
  'GET /admin/pubdocs/:page?': {
    action: 'backoffice/pubdoc/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/pubdoc/edit/:id': {
    action: 'backoffice/pubdoc/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/pubdoc/create': {
    action: 'backoffice/pubdoc/view-create',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/backups': {
    action: 'backoffice/backup/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/backups/download': {
    action: 'backoffice/backup/download',
  },

  'GET /admin/organization': {
    action: 'backoffice/organization/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/organization/:id': {
    action: 'backoffice/organization/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/organization/new': {
    action: 'entrance/view-new-organization',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/notification': {
    action: 'backoffice/notification/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/notification/new': {
    action: 'backoffice/notification/view-create',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/notification/:id': {
    action: 'backoffice/notification/view-edit',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/status': {
    action: 'backoffice/status/view-view',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/jobs/log/:page?': {
    action: 'backoffice/jobs/view-list',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },
  'GET /admin/jobs/queue': {
    action: 'backoffice/jobs/view-queue',
    locals: {
      layout: 'layouts/admin-layout',
    },
  },

  //pubdoc
  'GET /doc/:id?': {
    action: 'doc/view-page',
    locals: {
      layout: 'layouts/pub-layout',
    },
  },
  'GET /doc/policy': {
    action: 'doc/view-policy',
    locals: {
      layout: 'layouts/pub-layout',
    },
  },

  //contact
  'GET /contact': {
    action: 'contact/view-entry',
    locals: {
      layout: 'layouts/pub-layout',
    },
  },
  'GET /contact/confirm': {
    action: 'contact/view-confirm',
    locals: {
      layout: 'layouts/pub-layout',
    },
  },
  'GET /contact/complete': {
    action: 'contact/view-complete',
    locals: {
      layout: 'layouts/pub-layout',
    },
  },

  'GET /uploaderror/:type/:id': {
    action: 'view-upload-error',
  },

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  '/logout': '/api/v1/account/logout',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  'POST  /api/v1/thread': {
    action: 'dashboard/create-thread',
  },
  'POST  /api/v1/thread/mail/created/:id': {
    action: 'dashboard/created-send-mail',
  },
  'PUT  /api/v1/thread/:id': {
    action: 'dashboard/update-thread',
  },
  'PUT   /api/v1/thread/:id/state': {
    action: 'dashboard/update-thread-state',
  },
  'PUT   /api/v1/thread/:id/duedate': {
    action: 'dashboard/update-thread-duedate',
  },
  'PUT   /api/v1/thread/:id/priority': {
    action: 'dashboard/update-thread-priority',
  },
  'PUT   /api/v1/thread/:id/flag': {
    action: 'dashboard/update-thread-flag',
  },
  'PUT   /api/v1/thread/:id/lock': {
    action: 'dashboard/update-thread-lock',
  },
  'PUT   /api/v1/thread/:id/concept': {
    action: 'dashboard/update-thread-concept',
  },
  'PUT   /api/v1/thread/:id/working': {
    action: 'dashboard/update-thread-working',
  },
  'PUT   /api/v1/thread/:id/responsible': {
    action: 'dashboard/update-thread-responsible',
  },

  'POST   /api/v1/thread/:thread/sneeze': {
    action: 'dashboard/sneeze/create-sneeze',
  },
  'PUT   /api/v1/thread/sneeze/:id': {
    action: 'dashboard/sneeze/update-sneeze',
  },
  'DELETE   /api/v1/thread/sneeze/:id': {
    action: 'dashboard/sneeze/delete-sneeze',
  },
  'POST   /api/v1/thread/:sneeze/reply': {
    action: 'dashboard/reply/create-reply',
  },
  'PUT   /api/v1/thread/reply/:id': {
    action: 'dashboard/reply/update-reply',
  },
  'DELETE   /api/v1/thread/reply/:id': {
    action: 'dashboard/reply/delete-reply',
  },
  'GET /api/v1/thread/find/:team/:thread': {
    action: 'dashboard/query/query-thread-for-select2',
  },

  'GET /api/v1/query/counter': {
    action: 'dashboard/query/query-counter',
  },
  'GET /api/v1/query/threads/:id?': {
    action: 'dashboard/query/query-threads',
  },
  'GET /api/v1/query/my-threads/:id?': {
    action: 'dashboard/query/query-my-thread',
  },
  'GET /api/v1/query/activities/:id?': {
    action: 'dashboard/query/query-activity',
  },
  'GET /api/v1/query/buzz/:id?': {
    action: 'dashboard/query/query-buzz',
  },
  'GET /api/v1/query/flags/:id?': {
    action: 'dashboard/query/query-flag',
  },
  'GET /api/v1/query/locals/:id?': {
    action: 'dashboard/query/query-local',
  },
  'GET /api/v1/query/workings/:id?': {
    action: 'dashboard/query/query-working',
  },
  'GET /api/v1/query/git/:id': {
    action: 'dashboard/query/query-gitlog',
  },
  'GET /api/v1/query/members/:id': {
    action: 'dashboard/query/query-all-member',
  },
  'GET /api/v1/query/ambiguity/:id': {
    action: 'dashboard/query/query-ambiguity',
  },
  'GET /api/v1/query/votes': {
    action: 'dashboard/query/query-vote',
  },

  'GET /api/v1/find/thread/:no': {
    action: 'dashboard/query/find-thread',
  },

  'POST   /api/v1/thread/add-parent': {
    action: 'dashboard/refs/create-parent',
  },
  'POST   /api/v1/thread/add-child': {
    action: 'dashboard/refs/create-ref',
  },
  'DELETE   /api/v1/thread/delete-parent': {
    action: 'dashboard/refs/delete-parent',
  },
  'DELETE   /api/v1/thread/delete-child': {
    action: 'dashboard/refs/delete-ref',
  },

  //システム通知
  'GET /api/v1/notification/:page': {
    action: 'dashboard/notification/query-notification',
  },

  //添付ファイル
  'POST /api/v1/appendix/:type/:id': {
    controller: 'UploadFileController',
    action: 'upload',
  },
  'DELETE /api/v1/appendix/:type/:id/:fileId': {
    controller: 'UploadFileController',
    action: 'destroy',
  },
  'GET /appendix/:type/:id/:size/:fileId/:ext?': {
    action: 'appendix-view',
  },
  'GET /entrance/wiki/:id/:size/:fileId/:ext?': {
    action: 'entrance/public-appendeix-view',
  },
  'GET /download/:type/:id/:fileId': {
    action: 'appendix-download',
  },

  //milestone
  'POST   /api/v1/milestone': {
    action: 'dashboard/milestone/create-milestone',
  },
  'PUT   /api/v1/milestone/:id': {
    action: 'dashboard/milestone/update-milestone',
  },
  'DELETE /api/v1/milestone/:id': {
    action: 'dashboard/milestone/delete-milestone',
  },
  'PUT   /api/v1/milestone/sort': {
    action: 'dashboard/milestone/update-milestone-order',
  },

  //vote
  'POST   /api/v1/vote': {
    action: 'dashboard/vote/create-vote',
  },
  'PUT   /api/v1/vote/:id': {
    action: 'dashboard/vote/update-vote',
  },
  'POST   /api/v1/vote/confirm/:id': {
    action: 'dashboard/vote/confirm-circulation',
  },
  'POST   /api/v1/vote/answer/:id': {
    action: 'dashboard/vote/create-answer',
  },
  'PUT   /api/v1/vote/answer/:id': {
    action: 'dashboard/vote/update-answer',
  },

  '/api/v1/account/logout': {
    action: 'account/logout',
  },
  'PUT   /api/v1/account/update-password': {
    action: 'account/update-password',
  },
  'PUT   /api/v1/account/update-profile': {
    action: 'account/update-profile',
  },
  'POST   /api/v1/account/avatar-upload': {
    controller: 'account/AvatarUploadController',
    action: 'uploadAvatar',
  },
  'GET /avatar/:id/:fileId/:ext?': {
    action: 'account/avatar-view',
  },
  'PUT   /api/v1/entrance/login': {
    action: 'entrance/login',
  },
  'POST  /api/v1/entrance/send-password-recovery-email': {
    action: 'entrance/send-password-recovery-email',
  },
  'POST  /api/v1/entrance/update-password-and-login': {
    action: 'entrance/update-password-and-login',
  },
  'PUT  /api/v1/entrance/regist-organization': {
    action: 'entrance/regist-organization',
  },

  //wiki
  'POST  /api/v1/wiki': {
    action: 'wiki/create-wiki',
  },
  'PUT  /api/v1/wiki/:id': {
    action: 'wiki/update-wiki',
  },
  'DELETE  /api/v1/wiki/:id': {
    action: 'wiki/delete-wiki',
  },
  'GET /api/v1/wiki/query/:team?': {
    action: 'wiki/query-wiki',
  },
  'PUT   /api/v1/wiki/:id/flag': {
    action: 'wiki/update-wiki-flag',
  },
  'PUT   /api/v1/wiki/:id/vote': {
    action: 'wiki/update-wiki-vote',
  },
  'GET   /api/v1/wiki/subject/:id': {
    action: 'wiki/get-wiki-subject',
  },

  //member
  'GET /api/v1/member/analytics/:id': {
    action: 'member/analytics',
  },
  'GET /api/v1/member/messages/:id/:page?': {
    action: 'member/message-list',
  },
  'POST /api/v1/member/messages/create': {
    action: 'member/create-message',
  },
  'PUT /api/v1/member/messages/read/:id': {
    action: 'member/read-message',
  },

  //admin
  'POST   /api/v1/admin/user': {
    action: 'admin/user/create-user',
  },
  'PUT   /api/v1/admin/user/:id': {
    action: 'admin/user/update-user',
  },
  'DELETE /api/v1/admin/user/:id': {
    action: 'admin/user/delete-user',
  },
  'PUT   /api/v1/admin/user/:id/reset-password': {
    action: 'admin/user/reset-password',
  },
  'POST   /api/v1/admin/category': {
    action: 'admin/category/create-category',
  },
  'PUT   /api/v1/admin/category/:id': {
    action: 'admin/category/update-category',
  },
  'DELETE /api/v1/admin/category/:id': {
    action: 'admin/category/delete-category',
  },
  'PUT   /api/v1/admin/category/sort': {
    action: 'admin/category/update-category-order',
  },
  'POST   /api/v1/admin/team': {
    action: 'admin/team/create-team',
  },
  'PUT   /api/v1/admin/team/:id': {
    action: 'admin/team/update-team',
  },
  'DELETE /api/v1/admin/team/:id': {
    action: 'admin/team/delete-team',
  },
  'PUT   /api/v1/admin/wiki/deleted': {
    action: 'admin/wiki/update-wiki-deleted',
  },
  'PUT   /api/v1/admin/settings': {
    action: 'admin/settings/update-settings',
  },
  'POST  /api/v1/admin/plan/unsubscribed': {
    action: 'admin/plan/request-unsubscribed',
  },
  'POST  /api/v1/admin/plan/check-grade': {
    action: 'admin/plan/check-grade',
  },
  'POST  /api/v1/admin/plan/change': {
    action: 'admin/plan/request-change',
  },

  //backoffice
  'PUT   /api/v1/admin/database/backup': {
    action: 'backoffice/backup/backup',
  },
  'PUT   /api/v1/admin/database/recovery': {
    action: 'backoffice/backup/recovery',
  },
  'POST /api/v1/admin/database/backup/upload': {
    controller: 'backoffice/backup/uploadController',
    action: 'upload',
  },
  'PUT   /api/v1/admin/organization/:id': {
    action: 'backoffice/organization/update-organization',
  },
  'PUT   /api/v1/admin/organization/cancel/unsubscribed/:id': {
    action: 'backoffice/organization/cancel-unsubscribed',
  },
  'PUT   /api/v1/admin/organization/cancel/planchange/:id': {
    action: 'backoffice/organization/cancel-plan-change',
  },
  'DELETE /api/v1/admin/organization/:id': {
    action: 'backoffice/organization/delete-organization',
  },
  'POST   /api/v1/admin/notification': {
    action: 'backoffice/notification/create-notification',
  },
  'PUT   /api/v1/admin/notification/:id': {
    action: 'backoffice/notification/update-notification',
  },

  //contact
  'POST   /api/v1/contact/entry': {
    action: 'contact/entry-inquery',
  },
  'POST   /api/v1/contact/regist': {
    action: 'contact/regist-inquery',
  },
  'GET    /api/v1/captcha': {
    action: 'entrance/captcha',
  },

  //sockets
  'POST   /ws/v1/join-organization': {
    action: 'sockets/join-organization',
  },
  'POST   /ws/v1/team-in': {
    action: 'sockets/team-in',
  },
  'POST   /ws/v1/team-pon': {
    action: 'sockets/team-pon',
  },
  'POST   /ws/v1/team-out': {
    action: 'sockets/team-out',
  },
  'POST   /ws/v1/thread-in': {
    action: 'sockets/thread-in',
  },
  'POST   /ws/v1/thread-out': {
    action: 'sockets/thread-out',
  },
  'POST   /ws/v1/thread-pon': {
    action: 'sockets/thread-pon',
  },
  'POST   /ws/v1/thread-edit-in': {
    action: 'sockets/thread-edit-in',
  },
  'POST   /ws/v1/thread-edit-out': {
    action: 'sockets/thread-edit-out',
  },
  'POST   /ws/v1/thread-edit-query': {
    action: 'sockets/thread-edit-query',
  },
  'POST   /ws/v1/wiki-in': {
    action: 'sockets/wiki-in',
  },
  'POST   /ws/v1/wiki-out': {
    action: 'sockets/wiki-out',
  },
  'POST   /ws/v1/wiki-edit-in': {
    action: 'sockets/wiki-edit-in',
  },
  'POST   /ws/v1/wiki-edit-out': {
    action: 'sockets/wiki-edit-out',
  },

  //management
  'POST   /api/v1/management/auth': {
    action: 'delegate/authentication',
    csrf: false,
  },
  'GET   /api/v1/management/billings': {
    action: 'management/billing-list',
  },
  'GET   /api/v1/management/version': {
    action: 'management/version',
  },
  'GET   /api/v1/management/plans': {
    action: 'management/plan-list',
  },
  'PUT   /api/v1/management/disabled': {
    action: 'management/disable-organization',
    csrf: false,
  },
  'PUT   /api/v1/management/plan': {
    action: 'management/change-plan',
    csrf: false,
  },
  'PUT   /api/v1/management/policy': {
    action: 'management/update-policy',
    csrf: false,
  },
};
