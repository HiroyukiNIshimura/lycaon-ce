const dbdumper = require('../../../../jobs/db-dump');

module.exports = {
  friendlyName: 'Backup database',
  description: 'Backup database.',
  exits: {
    success: {
      description: 'Successfully Database Backup.',
    },
  },

  fn: async function () {
    var filename = '';
    try {
      filename = await dbdumper.backup();
      this.req.session.effectMessage = sails.__('Performed a database backup');
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return { filename: filename };
  },
};
