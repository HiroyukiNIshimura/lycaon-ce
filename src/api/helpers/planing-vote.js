module.exports = {
  friendlyName: 'planingVote',
  description: 'planing helper.',
  inputs: {
    organization: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
    vote: {
      type: 'ref',
      required: true,
      description: 'vote instance',
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

    const NATIVE_SQL_V_ITEM = `
  select sum("size") as "size"
    from "vote_item"
   where "vote" in
     (select "id"
        from "vote"
       where "organization" = $1)
      `;

    var organization = await Organization.findOne({ id: inputs.organization });
    if (!organization) {
      throw 'badRequest';
    }

    var plan = sails.config.custom.plans[organization.plan];

    var rawResult = await sails.sendNativeQuery(NATIVE_SQL_V_ITEM, [organization.id]);
    var size = rawResult.rows[0].size ? rawResult.rows[0].size : 0;
    if (plan.maxQuota) {
      if (plan.maxQuota <= size + inputs.appendSize) {
        return { valid: false, error: 'maxQuota' };
      }
    }

    if (plan.maxSizePerVote) {
      let current = await VoteItem.sum('size').where({ vote: inputs.vote.id });
      if (plan.maxSizePerWiki <= current + inputs.appendSize) {
        return { valid: false, error: 'maxSizePerVote' };
      }
    }

    if (plan.maxFilePerVote) {
      let current = await VoteItem.count({ vote: inputs.vote.id });
      if (plan.maxFilePerWiki <= current) {
        return { valid: false, error: 'maxFilePerVote' };
      }
    }
    return { valid: true };
  },
};
