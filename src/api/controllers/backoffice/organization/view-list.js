module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',
  inputs: {
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/organization/list',
    },
  },

  fn: async function (inputs) {
    var response = {};

    var pagination = await sails.helpers.pagination.with({
      page: inputs.page ? inputs.page : 1,
      rowPerPage: sails.config.custom.adminGridRowPerPage,
    });
    response.pagination = pagination;

    response.records = await Organization.count();
    response.organizations = await Organization.find({
      sort: 'id ASC',
      limit: pagination.limit,
      skip: pagination.skip,
    });

    const NATIVE_SQL_T = `
select count(*) as "qty"
  from "thread" 
 where "team" in 
    (select "id" 
       from "team" 
      where "organization" = $1)
    `;

    const NATIVE_SQL_T_item = `
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

    const NATIVE_SQL_W = `
select count(*) as "qty"
  from "wiki" 
 where "team" in 
    (select "id" 
       from "team" 
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

    const NATIVE_SQL_V = `
select count(*) as "qty"
  from "vote" 
 where "organization" = $1
    `;

    const NATIVE_SQL_V_ITEM = `
select sum("size") as "size" 
  from "vote_item" 
 where "vote" in 
   (select "id" 
      from "vote" 
     where "organization" = $1)
    `;

    for (let organization of response.organizations) {
      organization.billing = await Billing.findOne({ organization: organization.id });

      organization.userQty = await User.count({ organization: organization.id });
      organization.teamQty = await Team.count({ organization: organization.id });
      organization.categoryQty = await Category.count({ organization: organization.id });
      organization.tagQty = await Tag.count({ organization: organization.id });

      let rawResult = await sails.sendNativeQuery(NATIVE_SQL_T, [organization.id]);
      let qty = rawResult.rows[0].qty;
      organization.threadQty = qty ? qty : 0;

      rawResult = await sails.sendNativeQuery(NATIVE_SQL_W, [organization.id]);
      qty = rawResult.rows[0].qty;
      organization.wikiQty = qty ? qty : 0;

      rawResult = await sails.sendNativeQuery(NATIVE_SQL_V, [organization.id]);
      qty = rawResult.rows[0].qty;
      organization.voteQty = qty ? qty : 0;

      rawResult = await sails.sendNativeQuery(NATIVE_SQL_T_item, [organization.id]);
      let size = rawResult.rows[0].size;
      organization.threadItemSize = size ? size : 0;

      rawResult = await sails.sendNativeQuery(NATIVE_SQL_W_ITEM, [organization.id]);
      size = rawResult.rows[0].size;
      organization.wikiItemSize = size ? size : 0;

      rawResult = await sails.sendNativeQuery(NATIVE_SQL_V_ITEM, [organization.id]);
      size = rawResult.rows[0].size;
      organization.voteItemSize = size ? size : 0;
    }

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return response;
  },
};
