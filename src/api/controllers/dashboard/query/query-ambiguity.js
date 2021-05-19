module.exports = {
  friendlyName: 'Query ambiguity threads',
  description: 'Query ambiguity threads.',
  inputs: {
    word: {
      type: 'string',
      description: 'query word',
      maxLength: 50,
      required: true,
    },
    id: {
      type: 'number',
      description: 'team.id',
    },
    page: {
      type: 'number',
      description: 'For thread paginate',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Query threads successfully.',
    },
    notFound: {
      description: 'The user has accessed a thread that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var NATIVE_COUNT = `SELECT count("thread".*) as "qty" FROM "public"."thread"
`;

    var NATIVE_SELECT = `SELECT
        "thread"."id",
        "thread"."createdAt",
        "thread"."updatedAt",
        "thread"."no",
        "thread"."handleId",
        "thread"."subject",
        "thread"."body",
        "thread"."local",
        "thread"."concept",
        "thread"."status",
        "thread"."responsibleAt",
        "thread"."tagToken",
        "thread"."dueDateAt",
        "thread"."priority",
        "thread"."urgency",
        "thread"."working",
        "thread"."accessCount",
        "thread"."locked",
        "thread"."team",
        "thread"."milestone",
        "thread"."category",
        "thread"."owner",
        "thread"."responsible",
        "thread"."workingUser",
        "thread"."lastUpdateUser",
        "thread"."parent",
        "team__team"."id" as "team__id",
        "team__team"."createdAt" as "team__createdAt",
        "team__team"."updatedAt" as "team__updatedAt",
        "team__team"."name" as "team__name",
        "team__team"."description" as "team__description",
        "team__team"."useGit" as "team__useGit",
        "team__team"."gitOrigin" as "team__gitOrigin",
        "team__team"."connectType" as "team__connectType",
        "team__team"."gitRepository" as "team__gitRepository",
        "team__team"."gitUser" as "team__gitUser",
        "team__team"."gitPassword" as "team__gitPassword",
        "team__team"."gitlabApi" as "team__gitlabApi",
        "team__team"."gitlabToken" as "team__gitlabToken",
        "team__team"."gitlabProjectId" as "team__gitlabProjectId",
        "team__team"."deleted" as "team__deleted",
        "team__team"."isSandbox" as "team__isSandbox",
        "team__team"."organization" as "team__organization",
        "category__category"."id" as "category__id",
        "category__category"."createdAt" as "category__createdAt",
        "category__category"."updatedAt" as "category__updatedAt",
        "category__category"."name" as "category__name",
        "category__category"."displayOrder" as "category__displayOrder",
        "category__category"."useTemplate" as "category__useTemplate",
        "category__category"."templateSubject" as "category__templateSubject",
        "category__category"."templateBody" as "category__templateBody",
        "category__category"."deleted" as "category__deleted",
        "category__category"."isSandbox" as "category__isSandbox",
        "category__category"."organization" as "category__organization",
        "milestone__milestone"."id" as "milestone__id",
        "milestone__milestone"."createdAt" as "milestone__createdAt",
        "milestone__milestone"."updatedAt" as "milestone__updatedAt",
        "milestone__milestone"."name" as "milestone__name",
        "milestone__milestone"."lineNo" as "milestone__lineNo",
        "milestone__milestone"."startAt" as "milestone__startAt",
        "milestone__milestone"."duration" as "milestone__duration",
        "milestone__milestone"."progress" as "milestone__progress",
        "milestone__milestone"."user" as "milestone__user",
        "milestone__milestone"."team" as "milestone__team",
        "user__owner"."id" as "owner__id",
        "user__owner"."createdAt" as "owner__createdAt",
        "user__owner"."updatedAt" as "owner__updatedAt",
        "user__owner"."emailAddress" as "owner__emailAddress",
        "user__owner"."emailStatus" as "owner__emailStatus",
        "user__owner"."emailChangeCandidate" as "owner__emailChangeCandidate",
        "user__owner"."password" as "owner__password",
        "user__owner"."fullName" as "owner__fullName",
        "user__owner"."skil" as "owner__skil",
        "user__owner"."isSuperAdmin" as "owner__isSuperAdmin",
        "user__owner"."passwordResetToken" as "owner__passwordResetToken",
        "user__owner"."passwordResetTokenExpiresAt" as "owner__passwordResetTokenExpiresAt",
        "user__owner"."emailProofToken" as "owner__emailProofToken",
        "user__owner"."emailProofTokenExpiresAt" as "owner__emailProofTokenExpiresAt",
        "user__owner"."tosAcceptedByIp" as "owner__tosAcceptedByIp",
        "user__owner"."lastSeenAt" as "owner__lastSeenAt",
        "user__owner"."avatarType" as "owner__avatarType",
        "user__owner"."avatarVirtualPath" as "owner__avatarVirtualPath",
        "user__owner"."avatarVirtualUrl" as "owner__avatarVirtualUrl",
        "user__owner"."notNeedMyOwnEmail" as "owner__notNeedMyOwnEmail",
        "user__owner"."noRaiseThreadNotify" as "owner__noRaiseThreadNotify",
        "user__owner"."isNologin" as "owner__isNologin",
        "user__owner"."languagePreference" as "owner__languagePreference",
        "user__owner"."deleted" as "owner__deleted",
        "user__owner"."isSandbox" as "owner__isSandbox",
        "user__owner"."representative" as "owner__representative",
        "user__owner"."organization" as "owner__organization",
        "user__responsible"."id" as "responsible__id",
        "user__responsible"."createdAt" as "responsible__createdAt",
        "user__responsible"."updatedAt" as "responsible__updatedAt",
        "user__responsible"."emailAddress" as "responsible__emailAddress",
        "user__responsible"."emailStatus" as "responsible__emailStatus",
        "user__responsible"."emailChangeCandidate" as "responsible__emailChangeCandidate",
        "user__responsible"."password" as "responsible__password",
        "user__responsible"."fullName" as "responsible__fullName",
        "user__responsible"."skil" as "responsible__skil",
        "user__responsible"."isSuperAdmin" as "responsible__isSuperAdmin",
        "user__responsible"."passwordResetToken" as "responsible__passwordResetToken",
        "user__responsible"."passwordResetTokenExpiresAt" as "responsible__passwordResetTokenExpiresAt",
        "user__responsible"."emailProofToken" as "responsible__emailProofToken",
        "user__responsible"."emailProofTokenExpiresAt" as "responsible__emailProofTokenExpiresAt",
        "user__responsible"."tosAcceptedByIp" as "responsible__tosAcceptedByIp",
        "user__responsible"."lastSeenAt" as "responsible__lastSeenAt",
        "user__responsible"."avatarType" as "responsible__avatarType",
        "user__responsible"."avatarVirtualPath" as "responsible__avatarVirtualPath",
        "user__responsible"."avatarVirtualUrl" as "responsible__avatarVirtualUrl",
        "user__responsible"."notNeedMyOwnEmail" as "responsible__notNeedMyOwnEmail",
        "user__responsible"."noRaiseThreadNotify" as "responsible__noRaiseThreadNotify",
        "user__responsible"."isNologin" as "responsible__isNologin",
        "user__responsible"."languagePreference" as "responsible__languagePreference",
        "user__responsible"."deleted" as "responsible__deleted",
        "user__responsible"."isSandbox" as "responsible__isSandbox",
        "user__responsible"."representative" as "responsible__representative",
        "user__responsible"."organization" as "responsible__organization",
        "user__workingUser"."id" as "workingUser__id",
        "user__workingUser"."createdAt" as "workingUser__createdAt",
        "user__workingUser"."updatedAt" as "workingUser__updatedAt",
        "user__workingUser"."emailAddress" as "workingUser__emailAddress",
        "user__workingUser"."emailStatus" as "workingUser__emailStatus",
        "user__workingUser"."emailChangeCandidate" as "workingUser__emailChangeCandidate",
        "user__workingUser"."password" as "workingUser__password",
        "user__workingUser"."fullName" as "workingUser__fullName",
        "user__workingUser"."skil" as "workingUser__skil",
        "user__workingUser"."isSuperAdmin" as "workingUser__isSuperAdmin",
        "user__workingUser"."passwordResetToken" as "workingUser__passwordResetToken",
        "user__workingUser"."passwordResetTokenExpiresAt" as "workingUser__passwordResetTokenExpiresAt",
        "user__workingUser"."emailProofToken" as "workingUser__emailProofToken",
        "user__workingUser"."emailProofTokenExpiresAt" as "workingUser__emailProofTokenExpiresAt",
        "user__workingUser"."tosAcceptedByIp" as "workingUser__tosAcceptedByIp",
        "user__workingUser"."lastSeenAt" as "workingUser__lastSeenAt",
        "user__workingUser"."avatarType" as "workingUser__avatarType",
        "user__workingUser"."avatarVirtualPath" as "workingUser__avatarVirtualPath",
        "user__workingUser"."avatarVirtualUrl" as "workingUser__avatarVirtualUrl",
        "user__workingUser"."notNeedMyOwnEmail" as "workingUser__notNeedMyOwnEmail",
        "user__workingUser"."noRaiseThreadNotify" as "workingUser__noRaiseThreadNotify",
        "user__workingUser"."isNologin" as "workingUser__isNologin",
        "user__workingUser"."languagePreference" as "workingUser__languagePreference",
        "user__workingUser"."deleted" as "workingUser__deleted",
        "user__workingUser"."isSandbox" as "workingUser__isSandbox",
        "user__workingUser"."representative" as "workingUser__representative",
        "user__workingUser"."organization" as "workingUser__organization",
        "user__lastUpdateUser"."id" as "lastUpdateUser__id",
        "user__lastUpdateUser"."createdAt" as "lastUpdateUser__createdAt",
        "user__lastUpdateUser"."updatedAt" as "lastUpdateUser__updatedAt",
        "user__lastUpdateUser"."emailAddress" as "lastUpdateUser__emailAddress",
        "user__lastUpdateUser"."emailStatus" as "lastUpdateUser__emailStatus",
        "user__lastUpdateUser"."emailChangeCandidate" as "lastUpdateUser__emailChangeCandidate",
        "user__lastUpdateUser"."password" as "lastUpdateUser__password",
        "user__lastUpdateUser"."fullName" as "lastUpdateUser__fullName",
        "user__lastUpdateUser"."skil" as "lastUpdateUser__skil",
        "user__lastUpdateUser"."isSuperAdmin" as "lastUpdateUser__isSuperAdmin",
        "user__lastUpdateUser"."passwordResetToken" as "lastUpdateUser__passwordResetToken",
        "user__lastUpdateUser"."passwordResetTokenExpiresAt" as "lastUpdateUser__passwordResetTokenExpiresAt",
        "user__lastUpdateUser"."emailProofToken" as "lastUpdateUser__emailProofToken",
        "user__lastUpdateUser"."emailProofTokenExpiresAt" as "lastUpdateUser__emailProofTokenExpiresAt",
        "user__lastUpdateUser"."tosAcceptedByIp" as "lastUpdateUser__tosAcceptedByIp",
        "user__lastUpdateUser"."lastSeenAt" as "lastUpdateUser__lastSeenAt",
        "user__lastUpdateUser"."avatarType" as "lastUpdateUser__avatarType",
        "user__lastUpdateUser"."avatarVirtualPath" as "lastUpdateUser__avatarVirtualPath",
        "user__lastUpdateUser"."avatarVirtualUrl" as "lastUpdateUser__avatarVirtualUrl",
        "user__lastUpdateUser"."notNeedMyOwnEmail" as "lastUpdateUser__notNeedMyOwnEmail",
        "user__lastUpdateUser"."noRaiseThreadNotify" as "lastUpdateUser__noRaiseThreadNotify",
        "user__lastUpdateUser"."isNologin" as "lastUpdateUser__isNologin",
        "user__lastUpdateUser"."languagePreference" as "lastUpdateUser__languagePreference",
        "user__lastUpdateUser"."deleted" as "lastUpdateUser__deleted",
        "user__lastUpdateUser"."isSandbox" as "lastUpdateUser__isSandbox",
        "user__lastUpdateUser"."representative" as "lastUpdateUser__representative",
        "user__lastUpdateUser"."organization" as "lastUpdateUser__organization"
    FROM
        "public"."thread"
        LEFT OUTER JOIN "team" as "team__team" ON "thread"."team" = "team__team"."id"
        LEFT OUTER JOIN "category" as "category__category" ON "thread"."category" = "category__category"."id"
        LEFT OUTER JOIN "milestone" as "milestone__milestone" on "thread"."milestone" = "milestone__milestone"."id"
        LEFT OUTER JOIN "user" as "user__owner" on "thread"."owner" = "user__owner"."id"
        LEFT OUTER JOIN "user" as "user__responsible" on "thread"."responsible" = "user__responsible"."id"
        LEFT OUTER JOIN "user" as "user__workingUser" on "thread"."workingUser" = "user__workingUser"."id"
        LEFT OUTER JOIN "user" as "user__lastUpdateUser" on "thread"."lastUpdateUser" = "user__lastUpdateUser"."id" 
                `;

    var NATIVE_WHERE = `WHERE "thread"."team" = $1 
AND ("thread"."subject" ilike $2 OR "thread"."body" ilike $3
 OR "thread"."id" in (SELECT "thread" FROM "sneeze" WHERE "comment" ilike $4)
 OR "thread"."id" in (SELECT "thread" FROM "reply" WHERE "comment" ilike $5)
 OR "thread"."id" in (SELECT "thread" FROM "thread_item" WHERE "qWords" ilike $6)
 OR "thread"."id" = $7
      )
`;

    var NATIVE_WHERE2 = `WHERE "thread"."team" IN (SELECT "id" FROM "team" WHERE "organization" = $1)  
AND ("thread"."subject" ilike $2 OR "thread"."body" ilike $3
 OR "thread"."id" in (SELECT "thread" FROM "sneeze" WHERE "comment" ilike $4)
 OR "thread"."id" in (SELECT "thread" FROM "reply" WHERE "comment" ilike $5)
 OR "thread"."id" in (SELECT "thread" FROM "thread_item" WHERE "qWords" ilike $6)
 OR "thread"."id" = $7
      )
`;

    var NATIVE_ORDER = `ORDER BY "thread"."updatedAt" DESC, "thread"."id" ASC LIMIT $8 OFFSET $9
        `;

    var NATIVE_SNEEZE = `
SELECT "id", "comment", "thread"                  
  FROM "public"."sneeze"
 WHERE "comment" ilike $1
   AND "thread" = $2
    `;
    var NATIVE_REPLY = `
SELECT "id", "comment", "thread", "sneeze"                  
  FROM "public"."reply"
 WHERE "comment" ilike $1
   AND "thread" = $2
`;

    var NATIVE_ITEM = `
SELECT "id", "name", "virtualPath", "thread"                             
  FROM "public"."thread_item"
 WHERE "qWords" ilike $1
   AND "thread" = $2
    `;

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.threadGridRowPerPage,
    });
    response.pagination = pagination;

    var user = await User.findOne({
      id: this.req.me.id,
    }).populate('teams', { where: { deleted: false }, sort: 'id ASC' });
    if (user.teams.length < 1) {
      return response;
    }

    var sql;
    var params = [];

    if (inputs.id) {
      var team = await sails.helpers.validateMembership.with({
        id: inputs.id,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }

      sql = NATIVE_WHERE;
      params.push(inputs.id);
    } else {
      sql = NATIVE_WHERE2;
      params.push(this.req.me.organization.id);
    }

    var word = `%${inputs.word}%`;

    var _ = require('lodash');
    params = _.concat(params, [word, word, word, word, word]);

    if (!isNaN(inputs.word)) {
      params.push(inputs.word);
    } else {
      params.push(-1);
    }

    var escaped = await sails.helpers.regexEscape.with({ str: inputs.word });
    var re = new RegExp(`(${escaped})`, 'ig');

    var bind = async (row) => {
      var thread = {
        team: {},
        category: {},
        milestone: {},
        owner: {},
        responsible: {},
        workingUser: {},
        lastUpdateUser: {},

        tags: [],
        sneezeQty: 0,
        replyQty: 0,
      };

      _.forEach(row, (val, key) => {
        if (
          key !== '__proto__' &&
          key !== 'team' &&
          key !== 'category' &&
          key !== 'milestone' &&
          key !== 'owner' &&
          key !== 'responsible' &&
          key !== 'workingUser' &&
          key !== 'lastUpdateUser'
        ) {
          if (key.startsWith('team__')) {
            let col = key.replace('team__', '');
            thread.team[col] = val;
          } else if (key.startsWith('category__')) {
            let col = key.replace('category__', '');
            thread.category[col] = val;
          } else if (key.startsWith('milestone__')) {
            let col = key.replace('milestone__', '');
            thread.milestone[col] = val;
          } else if (key.startsWith('owner__')) {
            let col = key.replace('owner__', '');
            thread.owner[col] = val;
          } else if (key.startsWith('responsible__')) {
            let col = key.replace('responsible__', '');
            thread.responsible[col] = val;
          } else if (key.startsWith('workingUser__')) {
            let col = key.replace('workingUser__', '');
            thread.workingUser[col] = val;
          } else if (key.startsWith('lastUpdateUser__')) {
            let col = key.replace('lastUpdateUser__', '');
            thread.lastUpdateUser[col] = val;
          } else {
            thread[key] = val;
          }
        }
      });

      await User.setGravatarUrl(thread.owner, 36);
      await User.setGravatarUrl(thread.responsible, 36);
      await User.setGravatarUrl(thread.workingUser, 36);
      await User.setGravatarUrl(thread.lastUpdateUser, 36);

      var tags = await sails.models['tag_threads__thread_tags']
        .find({ thread_tags: thread.id })
        .populate('tag_threads');
      _.each(tags, (o) => {
        thread.tags.push(o.tag_threads);
      });

      thread.sneezeHits = [];
      thread.sneezeQty = await Sneeze.count({ thread: thread.id });
      if (thread.sneezeQty > 0) {
        let rawResult = await sails.sendNativeQuery(NATIVE_SNEEZE, [word, thread.id]);
        for (let row of rawResult.rows) {
          sails.log.info(row);
          let matches = row.comment.matchAll(re);
          for (let match of matches) {
            //
            var index = match.index - 10;
            if (index < 0) {
              index = 0;
            }

            thread.sneezeHits.push({
              id: row.id,
              sentence: row.comment.substr(index, inputs.word.length + 10),
            });
          }
        }
      }

      thread.replyHits = [];
      thread.replyQty = await Reply.count({ thread: thread.id });
      if (thread.replyQty > 0) {
        let rawResult = await sails.sendNativeQuery(NATIVE_REPLY, [word, thread.id]);
        for (let row of rawResult.rows) {
          let matches = row.comment.matchAll(re);
          for (let match of matches) {
            //
            var index = match.index - 10;
            if (index < 0) {
              index = 0;
            }

            thread.replyHits.push({
              id: row.id,
              sentence: row.comment.substr(index, inputs.word.length + 10),
            });
          }
        }
      }

      thread.itemHits = [];
      let rawResult = await sails.sendNativeQuery(NATIVE_ITEM, [word, thread.id]);
      for (let row of rawResult.rows) {
        thread.itemHits.push(row);
      }

      thread.hits = true;

      if (thread.body) {
        var matches = thread.body.matchAll(re);
        for (let match of matches) {
          //
          var index = match.index - 10;
          if (index < 0) {
            index = 0;
          }
          thread.hitsBody = thread.body.substr(index, inputs.word.length + 10);
          break;
        }

        delete thread.body;
      }
      return thread;
    };

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_COUNT + sql, params);
      response.records = rawResult.rows[0].qty;

      rawResult = await sails.sendNativeQuery(
        NATIVE_SELECT + sql + NATIVE_ORDER,
        _.concat(params, [pagination.limit, pagination.skip])
      );

      response.data = [];
      for (let row of rawResult.rows) {
        response.data.push(await bind(row));
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
