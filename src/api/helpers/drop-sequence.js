module.exports = {
  friendlyName: 'drop sequence',
  description: 'drop sequence.',
  inputs: {
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
    try {
      await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_thread_${inputs.handleId}";`);
      await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_wiki_${inputs.handleId}";`);

      return true;
    } catch (err) {
      sails.log.debug(err);
    }
    return false;
  },
};
