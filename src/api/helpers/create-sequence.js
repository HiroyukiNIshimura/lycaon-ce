module.exports = {
  friendlyName: 'create sequence',
  description: 'create sequence.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      description: 'organization.handleId',
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      await sails.sendNativeQuery(`CREATE SEQUENCE IF NOT EXISTS "org_thread_${inputs.handleId}" START 1;`);
      await sails.sendNativeQuery(`CREATE SEQUENCE IF NOT EXISTS "org_wiki_${inputs.handleId}" START 1;`);

      return true;
    } catch (err) {
      sails.log.debug(err);
    }
    return false;
  },
};
