module.exports = {
  friendlyName: 'View info',

  description: 'Display "Info" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/admin/plan/info',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a billing that has not joined.',
    },
  },

  fn: async function () {
    var response = {};

    response.billing = await Billing.findOne({ organization: this.req.organization.id });
    if (!response.billing) {
      throw 'notFound';
    }

    const NATIVE_SQL_T_ITEM = `
select sum("size") as "size" 
  from "thread_item" 
 where "thread" in 
   (select "id" 
      from "thread" 
     where "team" in 
       (select "id" 
          from "team" 
         where "organization" = $1))     
    `;

    const NATIVE_SQL_V_ITEM = `
  select sum("size") as "size" 
    from "vote_item" 
   where "vote" in 
     (select "id" 
        from "vote" 
       where "organization" = $1)
      `;

    const NATIVE_SQL_W_ITEM = `
select sum("size") as "size" 
  from "wiki_item" 
 where "wiki" in 
   (select "id" 
      from "wiki" 
     where "team" in 
       (select "id" 
          from "team" 
         where "organization" = $1))     
    `;
    var rawResult = await sails.sendNativeQuery(NATIVE_SQL_T_ITEM, [this.req.organization.id]);
    response.thread = rawResult.rows[0].size ? rawResult.rows[0].size : 0;

    rawResult = await sails.sendNativeQuery(NATIVE_SQL_V_ITEM, [this.req.organization.id]);
    response.vote = rawResult.rows[0].size ? rawResult.rows[0].size : 0;

    rawResult = await sails.sendNativeQuery(NATIVE_SQL_W_ITEM, [this.req.organization.id]);
    response.wiki = rawResult.rows[0].size ? rawResult.rows[0].size : 0;

    return response;
  },
};
