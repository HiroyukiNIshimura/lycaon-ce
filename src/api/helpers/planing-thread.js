module.exports = {
  friendlyName: 'planing helper',
  description: 'planing helper.',
  inputs: {
    organization: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
    thread: {
      type: 'ref',
      required: true,
      description: 'thread instance',
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

    var organization = await Organization.findOne({ id: inputs.organization });
    if (!organization) {
      throw 'badRequest';
    }

    var plan = sails.config.custom.plans[organization.plan];

    var rawResult = await sails.sendNativeQuery(NATIVE_SQL_T_ITEM, [organization.id]);
    var size = rawResult.rows[0].size ? rawResult.rows[0].size : 0;
    if (plan.maxQuota) {
      if (plan.maxQuota <= size + inputs.appendSize) {
        return { valid: false, error: 'maxQuota' };
      }
    }

    if (plan.maxSizePerThread) {
      var current = await ThreadItem.sum('size').where({ thread: inputs.thread.id });
      if (plan.maxSizePerThread <= current + inputs.appendSize) {
        return { valid: false, error: 'maxSizePerThread' };
      }
    }

    if (plan.maxFilePerThread) {
      var current = await ThreadItem.count({ thread: inputs.thread.id });
      if (plan.maxFilePerThread <= current) {
        return { valid: false, error: 'maxFilePerThread' };
      }
    }
    return { valid: true };
  },
};
