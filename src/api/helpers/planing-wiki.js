module.exports = {
  friendlyName: 'planing helper',
  description: 'planing helper.',
  inputs: {
    organization: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
    wiki: {
      type: 'ref',
      required: true,
      description: 'wiki instance',
    },
    appendSize: {
      type: 'number',
      required: true,
      description: '追加するファイルサイズ',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (sails.config.custom.isDemosite) {
      return { valid: true };
    }

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

    var organization = await Organization.findOne({ id: inputs.organization });
    if (!organization) {
      throw 'badRequest';
    }

    var plan = sails.config.custom.plans[organization.plan];

    var rawResult = await sails.sendNativeQuery(NATIVE_SQL_W_ITEM, [organization.id]);
    var size = rawResult.rows[0].size ? rawResult.rows[0].size : 0;
    if (plan.maxQuota) {
      if (plan.maxQuota <= size + inputs.appendSize) {
        return { valid: false, error: 'maxQuota' };
      }
    }

    if (plan.maxSizePerWiki) {
      var current = await WikiItem.sum('size').where({ wiki: inputs.wiki.id });
      if (plan.maxSizePerWiki <= current + inputs.appendSize) {
        return { valid: false, error: 'maxSizePerWiki' };
      }
    }

    if (plan.maxFilePerWiki) {
      var current = await WikiItem.count({ wiki: inputs.wiki.id });
      if (plan.maxFilePerWiki <= current) {
        return { valid: false, error: 'maxFilePerWiki' };
      }
    }
    return { valid: true };
  },
};
