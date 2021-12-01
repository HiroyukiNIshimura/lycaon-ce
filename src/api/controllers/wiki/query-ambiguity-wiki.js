module.exports = {
  friendlyName: 'Query ambiguity wikis',
  description: 'Query ambiguity wikis.',
  inputs: {
    word: {
      type: 'string',
      description: 'query word',
      custom: function (value) {
        return [...value].length <= 50;
      },
      required: true,
    },
    team: {
      type: 'number',
      description: 'team.id',
    },
    page: {
      type: 'number',
      description: 'For wiki paginate',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Query wikis successfully.',
    },
    notFound: {
      description: 'The user has accessed a wiki that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var response = {
      word: inputs.word,
    };

    var NATIVE_COUNT = `SELECT count("wiki".*) as "qty" FROM "public"."wiki"
`;

    var NATIVE_SELECT = `SELECT
        "wiki"."id",
        "wiki"."createdAt",
        "wiki"."updatedAt",
        "wiki"."no",
        "wiki"."handleId",
        "wiki"."subject",
        "wiki"."body",
        "wiki"."concept",
        "wiki"."tagToken",
        "wiki"."accessCount",
        "wiki"."nice",
        "wiki"."deleted",
        "wiki"."team",
        "wiki"."owner",
        "wiki"."lastUpdateUser",
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
        "public"."wiki"
        LEFT OUTER JOIN "team" as "team__team" ON "wiki"."team" = "team__team"."id"
        LEFT OUTER JOIN "user" as "user__owner" on "wiki"."owner" = "user__owner"."id"
        LEFT OUTER JOIN "user" as "user__lastUpdateUser" on "wiki"."lastUpdateUser" = "user__lastUpdateUser"."id"
        `;

    var NATIVE_WHERE = `WHERE "wiki"."concept" = 0
AND "wiki"."deleted" = false
AND "wiki"."team" = $1
AND ("wiki"."subject" ilike $2 OR "wiki"."body" ilike $3)
`;

    var NATIVE_WHERE2 = `WHERE "wiki"."concept" = 0
AND "wiki"."deleted" = false
AND "wiki"."team" IN (SELECT "id" FROM "team" WHERE "organization" = $1)
AND ("wiki"."subject" ilike $2 OR "wiki"."body" ilike $3)
`;

    var NATIVE_ORDER = `ORDER BY "wiki"."updatedAt" DESC, "wiki"."id" DESC LIMIT $4 OFFSET $5
        `;

    var NATIVE_ITEM = `
SELECT "id", "name", "virtualPath", "wiki"
  FROM "public"."wiki_item"
 WHERE "wiki" = $1
   AND "wiki"."concept" = 0
   AND "wiki"."deleted" = false
   AND "qWords" ilike $2
    `;

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.wikiGridRowPerPage,
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

    if (inputs.team) {
      var team = await sails.helpers.validateMembership.with({
        id: inputs.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }

      sql = NATIVE_WHERE;
      params.push(inputs.team);
    } else {
      sql = NATIVE_WHERE2;
      params.push(this.req.me.organization.id);
    }

    var word = `%${inputs.word}%`;

    var _ = require('lodash');
    params = _.concat(params, [word, word]);

    var escaped = await sails.helpers.regexEscape.with({ str: inputs.word });
    var re = new RegExp(`(${escaped})`, 'ig');

    var bind = async (row) => {
      var wiki = {
        team: {},
        owner: {},
        lastUpdateUser: {},
        tags: [],
        fans: [],
      };

      _.forEach(row, (val, key) => {
        if (key !== '__proto__' && key !== 'team' && key !== 'owner' && key !== 'lastUpdateUser') {
          if (key.startsWith('team__')) {
            let col = key.replace('team__', '');
            wiki.team[col] = val;
          } else if (key.startsWith('owner__')) {
            let col = key.replace('owner__', '');
            wiki.owner[col] = val;
          } else if (key.startsWith('lastUpdateUser__')) {
            let col = key.replace('lastUpdateUser__', '');
            wiki.lastUpdateUser[col] = val;
          } else {
            wiki[key] = val;
          }
        }
      });

      await User.setGravatarUrl(wiki.owner, 36);
      await User.setGravatarUrl(wiki.lastUpdateUser, 36);

      var tags = await sails.models['tag_wikis__wiki_tags']
        // eslint-disable-next-line camelcase
        .find({ wiki_tags: wiki.id })
        .populate('tag_wikis');
      _.each(tags, (o) => {
        wiki.tags.push(o.tag_wikis);
      });

      wiki.flags = await WikiFlag.find({ wiki: wiki.id, user: this.req.me.id });

      wiki.itemHits = [];
      let rawResult = await sails.sendNativeQuery(NATIVE_ITEM, [wiki.id, word]);
      for (let row of rawResult.rows) {
        wiki.itemHits.push(row);
      }

      wiki.hits = true;

      if (wiki.body) {
        var matches = wiki.body.matchAll(re);
        for (let match of matches) {
          //
          var index = match.index - 10;
          if (index < 0) {
            index = 0;
          }
          wiki.hitsBody = wiki.body.substr(index, inputs.word.length + 10);
          break;
        }

        delete wiki.body;
      }
      return wiki;
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
