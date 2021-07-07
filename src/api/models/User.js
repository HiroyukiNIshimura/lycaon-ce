/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {
  tableName: 'user',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      custom: function (value) {
        return [...value].length <= 300;
      },
      example: 'mary.sue@example.com',
    },

    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'change-requested', 'confirmed'],
      defaultsTo: 'confirmed',
      description: `The confirmation status of the user's email address.`,
      extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "change-requested"
email status until they click the link in the confirmation email.`,
    },

    emailChangeCandidate: {
      type: 'string',
      isEmail: true,
      description: 'A still-unconfirmed email address that this user wants to change to (if relevant).',
    },

    password: {
      type: 'string',
      required: true,
      description: `Securely hashed representation of the user's login password.`,
      protect: true,
      example: '2$28a8eabna301089103-13948134nad',
    },

    fullName: {
      type: 'string',
      required: true,
      description: `Full representation of the user's name.`,
      custom: function (value) {
        return [...value].length <= 120;
      },
      example: 'Mary Sue van der McHenst',
    },

    skil: {
      type: 'string',
      description: 'skil',
      custom: function (value) {
        return [...value].length <= 1000;
      },
      example: 'javaが好き',
    },

    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
      extendedDescription: `Super admins might have extra permissions, see a different default home page when they log in,
or even have a completely different feature set from normal users.  In this app, the \`isSuperAdmin\`
flag is just here as a simple way to represent two different kinds of users.  Usually, it's a good idea
to keep the data model as simple as possible, only adding attributes when you actually need them for
features being built right now.

For example, a "super admin" user for a small to medium-sized e-commerce website might be able to
change prices, deactivate seasonal categories, add new offerings, and view live orders as they come in.
On the other hand, for an e-commerce website like Walmart.com that has undergone years of development
by a large team, those administrative features might be split across a few different roles.

So, while this \`isSuperAdmin\` demarcation might not be the right approach forever, it's a good place to start.`,
    },

    passwordResetToken: {
      type: 'string',
      description:
        // eslint-disable-next-line quotes
        "A unique token used to verify the user's identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.",
    },

    passwordResetTokenExpiresAt: {
      type: 'ref',
      columnType: 'bigint',
      description:
        // eslint-disable-next-line quotes
        "A JS timestamp (epoch ms) representing the moment when this user's `passwordResetToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },

    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.',
    },

    emailProofTokenExpiresAt: {
      type: 'ref',
      columnType: 'bigint',
      description:
        // eslint-disable-next-line quotes
        "A JS timestamp (epoch ms) representing the moment when this user's `emailProofToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer',
    },

    lastSeenAt: {
      type: 'ref',
      columnType: 'bigint',
      defaultsTo: 0,
      description:
        'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211,
    },
    avatarType: {
      type: 'string',
      isIn: ['identify', 'user-avatar', 'gravatar'],
      defaultsTo: 'identify',
    },
    avatarVirtualPath: {
      type: 'string',
    },
    avatarVirtualUrl: {
      type: 'string',
    },
    notNeedMyOwnEmail: {
      type: 'boolean',
      description: '自分の起こしたアクティビティのメールはいらない',
    },
    noRaiseThreadNotify: {
      type: 'boolean',
      description: 'スレッド通知のトーストは不要',
    },
    isNologin: {
      type: 'boolean',
      description: 'ログイン不可なユーザー',
    },
    languagePreference: {
      type: 'string',
      defaultsTo: 'en',
      description: 'ユーザー指定のローケル',
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
    representative: {
      type: 'boolean',
      description: '代表者',
      example: 'true',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    organization: {
      model: 'organization',
    },
    teams: {
      collection: 'team',
      via: 'users',
    },
    sneezes: {
      collection: 'sneeze',
      via: 'owner',
    },
    replys: {
      collection: 'reply',
      via: 'owner',
    },
    threads: {
      collection: 'thread',
      via: 'owner',
    },
    milestones: {
      collection: 'milestone',
      via: 'user',
    },
    threadItems: {
      collection: 'threadItem',
      via: 'owner',
    },
    wikis: {
      collection: 'wiki',
      via: 'owner',
    },
    wikiItems: {
      collection: 'wikiItem',
      via: 'owner',
    },
    responsibles: {
      collection: 'thread',
      via: 'responsible',
    },
    threadActivities: {
      collection: 'threadActivity',
      via: 'user',
    },
    flags: {
      collection: 'thread',
      via: 'fans',
    },
    wikiflags: {
      collection: 'wiki',
      via: 'fans',
    },
    wikivotes: {
      collection: 'wiki',
      via: 'votes',
    },
    emailNoThankYous: {
      collection: 'team',
      via: 'emailNoThankYous',
    },
    sendMailTags: {
      collection: 'tag',
      via: 'users',
    },
    sendMailCategories: {
      collection: 'category',
      via: 'users',
    },
    votes: {
      collection: 'vote',
      via: 'users',
    },
    sysNotifications: {
      collection: 'SysNotification',
      via: 'users',
    },
  },

  //function
  customToJSON: function () {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, [
      'password',
      'passwordResetToken',
      'passwordResetTokenExpiresAt',
      'emailProofToken',
      'emailProofTokenExpiresAt',
      'tosAcceptedByIp',
    ]);
  },
  setGravatarUrl: async function (user, size = 42) {
    if (!user) {
      return;
    }
    if (user.avatarType === 'gravatar') {
      user.gravatarUrl = await sails.helpers.parseGravatarUrl.with({
        email: user.emailAddress,
        size: size,
      });
    }
  },
};
