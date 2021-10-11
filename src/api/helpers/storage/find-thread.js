module.exports = {
  friendlyName: 'findThread',
  description: 'find threads.',
  inputs: {
    whereClause: {
      type: 'ref',
    },
    sort: {
      type: 'ref',
    },
    pagination: {
      type: 'ref',
    },
    user: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var sort = inputs.sort;
    if (!inputs.sort) {
      sort = [{ lastHumanUpdateAt: 'DESC' }, { id: 'ASC' }];
    }

    var response = await Thread.find({
      where: inputs.whereClause,
      sort: sort,
      limit: inputs.pagination.limit,
      skip: inputs.pagination.skip,
    })
      .populate('team')
      .populate('tags', {
        sort: 'name',
      })
      .populate('sneezes')
      .populate('replys')
      .populate('category')
      .populate('milestone')
      .populate('owner')
      .populate('responsible')
      .populate('workingUser')
      .populate('lastUpdateUser')
      .populate('flags', { where: { user: inputs.user.id } });

    for (let entry of response) {
      await User.setGravatarUrl(entry.owner, 36);
      await User.setGravatarUrl(entry.responsible, 36);
      await User.setGravatarUrl(entry.workingUser, 36);
      await User.setGravatarUrl(entry.lastUpdateUser, 36);
      entry.sneezeQty = entry.sneezes.length;
      entry.replyQty = entry.replys.length;
      delete entry.sneezes;
      delete entry.replys;
      delete entry.body;
    }
    return response;
  },
};
