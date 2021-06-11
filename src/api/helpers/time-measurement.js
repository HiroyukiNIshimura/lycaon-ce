module.exports = {
  friendlyName: 'timeMeasurement',
  description: 'time measurement.',
  inputs: {
    db: {
      type: 'ref',
      description: 'db instance',
      required: true,
    },
    thread: {
      type: 'ref',
      description: 'thread instance',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      var activites = await ThreadActivity.find({
        thread: inputs.thread.id,
        type: ['create', 'update-working', 'update-status'],
      })
        .sort('updatedAt ASC')
        .usingConnection(inputs.db);

      var valueSets = {};

      var startElement = _.find(activites, { type: 'create' });
      if (startElement) {
        var closeElement = _.findLast(activites, function (element) {
          return element.type === 'update-status' && element.stateWord === 'close';
        });
        if (closeElement) {
          valueSets.openCloseElapsed = closeElement.updatedAt - startElement.updatedAt;
        }
      }

      if (inputs.thread.status === 1 && !valueSets.openCloseElapsed) {
        valueSets.openCloseElapsed = inputs.thread.updatedAt - inputs.thread.createdAt;
      }

      var st = 0;
      var workingCloseElapsed = 0;

      for (let element of activites) {
        if (element.type === 'update-working' && element.stateWord === 'Working') {
          st = element.updatedAt;
        }

        if (
          (element.type === 'update-working' && element.stateWord === 'Release work') ||
          (element.type === 'update-status' && element.stateWord === 'close')
        ) {
          if (st > 0) {
            workingCloseElapsed += element.updatedAt - st;
            st = 0;
          }
        }
      }

      if (workingCloseElapsed > 0) {
        valueSets.workingCloseElapsed = workingCloseElapsed;
      }

      if (valueSets.openCloseElapsed || valueSets.workingCloseElapsed) {
        await Thread.updateOne({ id: inputs.thread.id }).set(valueSets).usingConnection(inputs.db);
      }
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
