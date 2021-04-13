const Agenda = require('agenda');

module.exports = {
  friendlyName: 'View queue',

  description: 'Display "Queue" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/jobs/queue',
    },
  },

  fn: async function () {
    try {
      var agenda = new Agenda({
        db: {
          address: sails.config.custom.agenda.mongoUrl,
          collection: sails.config.custom.agenda.collection,
          options: sails.config.custom.agenda.options,
        },
      });

      await agenda.start();

      var jobs = await agenda.jobs();

      await agenda.close();

      var respons = {
        jobs: [],
      };

      for (let job of jobs) {
        var entry = _.find(sails.config.custom.agenda.jobs, { name: job.attrs.name });
        job.attrs.description = entry ? entry.description : '';
        respons.jobs.push(job.attrs);
      }

      return respons;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
