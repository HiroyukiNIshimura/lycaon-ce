/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {
  /**************************************************************************
   *                                                                         *
   * The base URL to use during development.                                 *
   *                                                                         *
   * • No trailing slash at the end                                          *
   * • `http://` or `https://` at the beginning.                             *
   *                                                                         *
   * > This is for use in custom logic that builds URLs.                     *
   * > It is particularly handy for building dynamic links in emails,        *
   * > but it can also be used for user-uploaded images, webhooks, etc.      *
   *                                                                         *
   **************************************************************************/
  baseUrl: "http://localhost:1337",

  /**************************************************************************
   *                                                                         *
   * Display names/dates for your app                                        *
   *                                                                         *
   * > These are here to make it easier to change out the placeholder        *
   * > platform name, company name, etc. that are displayed all over the     *
   * > app when it's first generated.                                        *
   *                                                                         *
   **************************************************************************/
  platformCopyrightYear: "2020",
  platformName: "Lycaon",
  platformCompanyName: "example.com",
  platformCompanyAboutHref: "https://example.com/",
  privacyPolicyUpdatedAt: "2020.10.10",
  termsOfServiceUpdatedAt: "2020.10.10",

  /**************************************************************************
   *                                                                         *
   * The TTL (time-to-live) for various sorts of tokens before they expire.  *
   *                                                                         *
   **************************************************************************/
  passwordResetTokenTTL: 24 * 60 * 60 * 1000, // 24 hours
  emailProofTokenTTL: 24 * 60 * 60 * 1000, // 24 hours
  freePlanNotAccessTTL: 30 * 24 * 60 * 60 * 1000, // 30 days

  /**************************************************************************
   *                                                                         *
   * The extended length that browsers should retain the session cookie      *
   * if "Remember Me" was checked while logging in.                          *
   *                                                                         *
   **************************************************************************/
  rememberMeCookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Whether to require proof of email address ownership any time a new user
  // signs up, or when an existing user attempts to change their email address.
  verifyEmailAddresses: true,

  /***************************************************************************
   *                                                                          *
   * Any other custom config this Sails app should use during development.    *
   *                                                                          *
   ***************************************************************************/
  // …
  backoffice: {
    authServer: "https://example.com",
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  simpleCrypto: {
    encryptionKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    bufferKey: "xxxxxxxxxxxxxx",
  },
  bot: {
    tweetTTL: 15 * 1000, // 15 sec
    retweetRate: 100, //1〜100
    emotionLimit: 0.7,
  },
  sysNotificationSendMailTTL: 7 * 24 * 60 * 60 * 1000, //  7 days
  sysNotificationDeleteAge: 180 * 24 * 60 * 60 * 1000, //  180 days
  messageDeleteAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  mailSendTTL: 30 * 1000, // 30 sec
  socketMessageResetTokenTTL: 5 * 60 * 1000, // 5 min
  threadGridRowPerPage: 12,
  adminGridRowPerPage: 12,
  messageGridRowPerPage: 5,
  cheetahGridRowPerPage: 100,
  witeListOfExts: [
    ".zip",
    ".txt",
    ".pdf",
    ".gif",
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".mp3",
    ".mid",
    ".wma",
    ".wav",
    ".avi",
    ".wmv",
    ".mpg",
    ".mp4",
    ".docx",
    ".xlsx",
    ".pptx",
  ],
  helpPageUrl: "https://example.com/doc",
  smtpSettings: {
    host: "mail.example.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: "ユーザー",
      pass: "パスワード",
    },
  },
  backofficeMailAddress: "support@example.com",
  agenda: {
    collection: "lycaonJobs",
    mongoUrl: "mongodb://localhost:27017/lycaon-job-db",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    jobs: {
      gitLogUpdate: {
        name: "jobs-git-log-update",
        description: "gitログ同期",
        every: "180 seconds",
      },
      unsubscribed: {
        name: "jobs-unsubscribed",
        description: "退会処理",
        every: "02 3 1 * *",
      },
      recommendation: {
        name: "jobs-recommendation",
        description: "未使用に対する退会勧告メール",
        every: "05 10 * * 1",
      },
      dbBackup: {
        name: "jobs-db-backup",
        description: "DBバックアップ",
        every: "02 4 * * *",
      },
      urgency: {
        name: "jobs-update-urgency",
        description: "緊急度更新",
        every: "5 minutes",
      },
      votemail: {
        name: "jobs-vote-mail",
        description: "回覧公開メール",
        every: "32 7 * * *",
        expier: 24 * 60 * 60 * 1000, //1日
      },
      weeklyreport: {
        name: "jobs-weekly-report",
        description: "週次レポート",
        every: "02 7 * * *",
      },
      sysNotification: {
        name: "jobs-sys-notification",
        description: "システム通知",
        every: "02 10 * * 0",
      },
      dataCleaning: {
        name: "jobs-data-cleaning",
        description: "不要データ削除処理",
        every: "02 1 * * *",
      },
      loadAverage: {
        name: "jobs-load-average",
        description: "ロードアベレージ収集",
        every: "0,15,30,45 * * * *",
      },
    },
  },
  plans: {
    example: {
      maxUser: undefined,
      maxTeam: undefined,
      maxSizePerThread: undefined,
      maxFilePerThread: undefined,
      maxSizePerWiki: undefined,
      maxFilePerWiki: undefined,
      maxSizePerVote: undefined,
      maxFilePerVote: undefined,
      maxQuota: undefined,
      allowUseGit: true,
    },
  },
  backup: {
    autoDbBackup: true,
    dbBackupStocks: 7,
  },
  similarity: {
    subjectLimt: 0.8,
    bodyLimit: 0.2,
  },
  diskspace: {
    root: "/",
    data: "/var",
  },
  mindmap: {
    rootDepth: 3,
    capacity: 30,
  },
  useRegistOrganization: true,
  usePublicWiki: true,
  isDemosite: false,
};
