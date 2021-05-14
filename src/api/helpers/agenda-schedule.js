const Agenda = require('agenda');

module.exports = {
  friendlyName: 'agendaSchedule',
  description: 'agenda scheduling.',
  inputs: {
    ttl: {
      type: 'ref',
    },
    job: {
      type: 'string',
    },
    data: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var agenda = new Agenda({
      db: {
        address: sails.config.custom.agenda.mongoUrl,
        collection: sails.config.custom.agenda.collection,
        options: sails.config.custom.agenda.options,
      },
    });

    await agenda.start();

    try {
      await agenda.schedule(inputs.ttl, inputs.job, inputs.data);
    } finally {
      await agenda.close();
    }
  },
};
