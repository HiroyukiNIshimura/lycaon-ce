const moment = require('moment');

module.exports = {
  friendlyName: 'writeJobLog',

  description: 'Write Jobs log.',

  inputs: {
    jobName: {
      type: 'string',
      required: true,
    },
    runAt: {
      type: 'ref',
      columnType: 'bigint',
    },
    finishedAt: {
      type: 'ref',
      columnType: 'bigint',
    },
    result: {
      type: 'string',
      isIn: ['success', 'skip', 'failure', 'error'],
      defaultsTo: 'success',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    var at = moment().add(-2, 'quarters').valueOf();
    var job = _.find(sails.config.custom.agenda.jobs, { name: inputs.jobName });
    var valueSet = _.extend({ description: job ? job.description : '' }, inputs);

    try {
      await sails.getDatastore().transaction(async (db) => {
        await JobLog.destroy({ createdAt: { '<': at } }).usingConnection(db);
        await JobLog.create(valueSet).usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
    }
  },
};
