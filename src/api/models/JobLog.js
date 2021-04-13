module.exports = {
  tableName: 'job_log',
  attributes: {
    jobName: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
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
      isIn: ['success', 'skip', 'error', 'failure'],
      defaultsTo: 'success',
    },
  },
};
