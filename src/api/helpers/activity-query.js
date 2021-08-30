module.exports = {
  friendlyName: 'activity sql helper',
  description: 'activity sql helper utility.',
  inputs: {
    where: {
      type: 'string',
    },
    bindParameters: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var NATIVE_ACTIVITY_SQL = `
SELECT
    "thread_activity"."id",
    "thread_activity"."createdAt",
    "thread_activity"."updatedAt",
    "thread_activity"."stateWord",
    "thread_activity"."userName",
    "thread_activity"."fileName",
    "thread_activity"."targetDate",
    "thread_activity"."type",
    "thread_activity"."team",
    "thread_activity"."thread",
    "thread_activity"."user",
    "thread_activity"."sneeze",
    "thread_activity"."reply",
    "user__user"."id" as "user__id",
    "user__user"."createdAt" as "user__createdAt",
    "user__user"."updatedAt" as "user__updatedAt",
    "user__user"."emailAddress" as "user__emailAddress",
    "user__user"."fullName" as "user__fullName",
    "user__user"."isSuperAdmin" as "user__isSuperAdmin",
    "user__user"."lastSeenAt" as "user__lastSeenAt",
    "user__user"."avatarType" as "user__avatarType",
    "user__user"."avatarVirtualPath" as "user__avatarVirtualPath",
    "user__user"."avatarVirtualUrl" as "user__avatarVirtualUrl",
    "user__user"."deleted" as "user__deleted",
    "user__user"."isSandbox" as "user__isSandbox",
    "team__team"."id" as "team__id",
    "team__team"."name" as "team__name",
    "thread__thread"."id" as "thread__id",
    "thread__thread"."no" as "thread__no",
    "thread__thread"."createdAt" as "thread__createdAt",
    "thread__thread"."updatedAt" as "thread__updatedAt",
    "thread__thread"."subject" as "thread__subject",
    "thread__thread"."body" as "thread__body",
    "thread__thread"."local" as "thread__local",
    "thread__thread"."concept" as "thread__concept",
    "thread__thread"."status" as "thread__status",
    "thread__thread"."locked" as "thread__locked",
    "thread__thread"."responsibleAt" as "thread__responsibleAt",
    "thread__thread"."team" as "thread__team",
    "thread__thread"."category" as "thread__category",
    "thread__thread"."owner" as "thread__owner",
    "thread__thread"."responsible" as "thread__responsible",
    "thread__thread"."lastUpdateUser" as "thread__lastUpdateUser",
    "thread__thread"."lastHumanUpdateAt" as "thread__lastHumanUpdateAt",
    "category__category"."id" as "category__id",
    "category__category"."name" as "category__name",
    "category__category"."displayOrder" as "category__displayOrder",
    "user__responsible"."id" as "responsible__id",
    "user__responsible"."emailAddress" as "responsible__emailAddress",
    "user__responsible"."fullName" as "responsible__fullName",
    "user__responsible"."isSuperAdmin" as "responsible__isSuperAdmin",
    "user__responsible"."lastSeenAt" as "responsible__lastSeenAt",
    "user__responsible"."avatarType" as "responsible__avatarType",
    "user__responsible"."avatarVirtualPath" as "responsible__avatarVirtualPath",
    "user__responsible"."avatarVirtualUrl" as "responsible__avatarVirtualUrl",
    "user__responsible"."deleted" as "responsible__deleted",
    "user__responsible"."isSandbox" as "responsible__isSandbox",
    "user__owner"."id" as "owner__id",
    "user__owner"."emailAddress" as "owner__emailAddress",
    "user__owner"."fullName" as "owner__fullName",
    "user__owner"."isSuperAdmin" as "owner__isSuperAdmin",
    "user__owner"."lastSeenAt" as "owner__lastSeenAt",
    "user__owner"."avatarType" as "owner__avatarType",
    "user__owner"."avatarVirtualPath" as "owner__avatarVirtualPath",
    "user__owner"."avatarVirtualUrl" as "owner__avatarVirtualUrl",
    "user__owner"."deleted" as "owner__deleted",
    "user__owner"."isSandbox" as "owner__isSandbox",
    "user__lastUpdateUser"."id" as "lastUpdateUser__id",
    "user__lastUpdateUser"."emailAddress" as "lastUpdateUser__emailAddress",
    "user__lastUpdateUser"."fullName" as "lastUpdateUser__fullName",
    "user__lastUpdateUser"."isSuperAdmin" as "lastUpdateUser__isSuperAdmin",
    "user__lastUpdateUser"."lastSeenAt" as "lastUpdateUser__lastSeenAt",
    "user__lastUpdateUser"."avatarType" as "lastUpdateUser__avatarType",
    "user__lastUpdateUser"."avatarVirtualPath" as "lastUpdateUser__avatarVirtualPath",
    "user__lastUpdateUser"."avatarVirtualUrl" as "lastUpdateUser__avatarVirtualUrl",
    "user__lastUpdateUser"."deleted" as "lastUpdateUser__deleted",
    "user__lastUpdateUser"."isSandbox" as "lastUpdateUser__isSandbox"
FROM
    "public"."thread_activity"
    left outer join "thread" as "thread__thread" on "thread__thread"."id" = "thread_activity"."thread"
    left outer join "user" as "user__user" on "user__user"."id" = "thread_activity"."user"
    left outer join "team" as "team__team" on "team__team"."id" = "thread_activity"."team"
    left outer join "category" as "category__category" on "thread__thread"."category" = "category__category"."id"
    left outer join "user" as "user__responsible" on "thread__thread"."responsible" = "user__responsible"."id"
    left outer join "user" as "user__owner" on "thread__thread"."owner" = "user__owner"."id"
    left outer join "user" as "user__lastUpdateUser" on "thread__thread"."lastUpdateUser" = "user__lastUpdateUser"."id"
`;
    NATIVE_ACTIVITY_SQL = NATIVE_ACTIVITY_SQL + inputs.where;

    var response = [];

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_ACTIVITY_SQL, inputs.bindParameters);

      var bind = async (row) => {
        var activity = {
          user: {},
          team: {},
          thread: {
            owner: {},
            responsible: {},
            lastUpdateUser: {},
          },
          sneeze: {},
          reply: {},
        };

        _.forEach(row, (val, key) => {
          if (
            key !== '__proto__' &&
            key !== 'user' &&
            key !== 'team' &&
            key !== 'thread' &&
            key !== 'sneeze' &&
            key !== 'reply'
          ) {
            if (key.startsWith('thread__')) {
              let col = key.replace('thread__', '');
              if (col !== 'owner' && col !== 'responsible' && col !== 'lastUpdateUser') {
                activity.thread[col] = val;
              }
            } else if (key.startsWith('user__')) {
              let col = key.replace('user__', '');
              activity.user[col] = val;
            } else if (key.startsWith('team__')) {
              let col = key.replace('team__', '');
              activity.team[col] = val;
            } else if (key.startsWith('category__')) {
              let col = key.replace('category__', '');
              activity.thread.category[col] = val;
            } else if (key.startsWith('owner__')) {
              let col = key.replace('owner__', '');
              activity.thread.owner[col] = val;
            } else if (key.startsWith('responsible__')) {
              let col = key.replace('responsible__', '');
              activity.thread.responsible[col] = val;
            } else if (key.startsWith('lastUpdateUser__')) {
              let col = key.replace('lastUpdateUser__', '');
              activity.thread.lastUpdateUser[col] = val;
            } else if (key.startsWith('sneeze__')) {
              let col = key.replace('sneeze__', '');
              activity.sneeze[col] = val;
            } else if (key.startsWith('reply__')) {
              let col = key.replace('reply__', '');
              activity.reply[col] = val;
            } else {
              activity[key] = val;
            }
          }
        });

        await User.setGravatarUrl(activity.user, 36);
        await User.setGravatarUrl(activity.thread.owner, 36);
        await User.setGravatarUrl(activity.thread.responsible, 36);
        await User.setGravatarUrl(activity.thread.lastUpdateUser, 36);

        return activity;
      };

      for (let row of rawResult.rows) {
        response.push(await bind(row));
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
