module.exports = {
  friendlyName: 'get sequence nextval',
  description: 'get sequence nextval.',
  inputs: {
    target: {
      type: 'string',
      isIn: ['thread', 'wiki'],
      defaultsTo: 'thread',
    },
    handleId: {
      type: 'string',
      required: true,
      description: 'organization.handleId',
      maxLength: 10,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var rawResult;

    try {
      if (inputs.target === 'thread') {
        rawResult = await sails.sendNativeQuery(`SELECT nextval('org_thread_${inputs.handleId}');`);
      } else {
        rawResult = await sails.sendNativeQuery(`SELECT nextval('org_wiki_${inputs.handleId}');`);
      }

      if (!rawResult) {
        return false;
      }

      return rawResult.rows[0].nextval;
    } catch (err) {
      sails.log.debug(err);
    }
    return false;
  },
};
