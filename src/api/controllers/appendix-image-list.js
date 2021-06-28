module.exports = {
  friendlyName: 'List Appendix images',
  description: 'List Appendix images.',
  inputs: {
    page: {
      type: 'number',
      required: true,
    },
  },
  exits: {},

  fn: async function (inputs) {
    var NATIVE_COUNT_SQL = `
SELECT (
  (SELECT COUNT(*)  
     FROM public.thread_item
    WHERE thread IN (
      SELECT id
        FROM public.thread
       WHERE team IN (
         SELECT team_users
           FROM public.team_users__user_teams
          WHERE user_teams = $1
       )
    )
      AND "mimeType" like 'image/%')
+ (SELECT COUNT(*)  
     FROM public.wiki_item
    WHERE wiki IN (
      SELECT id
        FROM public.wiki
       WHERE team IN (
         SELECT team_users
           FROM public.team_users__user_teams
          WHERE user_teams = $2
       )
    )
      AND "mimeType" like 'image/%')
+ (SELECT COUNT(*)  
     FROM public.vote_item
    WHERE vote IN (
      SELECT id
        FROM public.vote
       WHERE organization = $3
    )
      AND "mimeType" like 'image/%')
) as qty
    `;

    var NATIVE_SELECT_SQL = `
SELECT t.* FROM (
  (SELECT "id", "name", "virtualUrl", "virtualUrlMid", "virtualUrlSmall", "hashName", "size", "mimeType", 'thread' as parent  
     FROM public.thread_item
    WHERE thread IN (
      SELECT id
        FROM public.thread
       WHERE team IN (
         SELECT team_users
           FROM public.team_users__user_teams
          WHERE user_teams = $1
       )
    )
      AND "mimeType" like 'image/%')
  UNION ALL
  (SELECT "id", "name", "virtualUrl", "virtualUrlMid", "virtualUrlSmall", "hashName", "size", "mimeType", 'wiki' as parent    
     FROM public.wiki_item
    WHERE wiki IN (
      SELECT id
        FROM public.wiki
       WHERE team IN (
         SELECT team_users
           FROM public.team_users__user_teams
          WHERE user_teams = $2
       )
    )
      AND "mimeType" like 'image/%')
  UNION ALL
  (SELECT "id", "name", "virtualUrl", "virtualUrlMid", "virtualUrlSmall", "hashName", "size", "mimeType", 'vote' as parent    
     FROM public.vote_item
    WHERE vote IN (
      SELECT id
        FROM public.vote
       WHERE organization = $3
    )
      AND "mimeType" like 'image/%')
) t
ORDER BY t."id" DESC, t."hashName" DESC
LIMIT $4 OFFSET $5
`;

    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page,
      rowPerPage: sails.config.custom.imageGridRowPerPage,
    });
    response.pagination = pagination;

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL, [
        this.req.me.id,
        this.req.me.id,
        this.req.me.organization.id,
      ]);
      response.records = rawResult.rows[0].qty;

      rawResult = await sails.sendNativeQuery(NATIVE_SELECT_SQL, [
        this.req.me.id,
        this.req.me.id,
        this.req.me.organization.id,
        pagination.limit,
        pagination.skip,
      ]);
      response.data = rawResult.rows;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return response;
  },
};
