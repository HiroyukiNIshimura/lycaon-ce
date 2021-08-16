const os = require('os');
const df = require('node-df');
const fs = require('fs');
const path = require('path');

module.exports = {
  friendlyName: 'View view',

  description: 'Display "View" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/status/view',
    },
  },

  fn: async function () {
    function diskspacePromise() {
      return new Promise((resolve, reject) => {
        df((error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    }

    var response = {};
    response.sysStatus = await SysStatus.findOne({ id: 1 });
    response.sailsInfo = {
      version: sails.version,
      environment: sails.config.environment,
    };
    response.nodejsInfo = {
      version: process.version,
    };

    var NATIVE_SQL = `SELECT datname, pg_size_pretty(pg_database_size(datname)) as size FROM pg_database WHERE datname = 'lycaondb'`;
    var rawResult = await sails.sendNativeQuery(NATIVE_SQL);
    response.dbSize = {
      dbname: 'lycaondb',
      size: rawResult.rows[0].size,
    };

    var cpus = os.cpus();
    var loads = [];
    for (var i = 0, len = cpus.length; i < len; i++) {
      var cpu = cpus[i];
      var total = 0;
      for (let type in cpu.times) {
        total += cpu.times[type];
      }

      var load = {};
      for (let type in cpu.times) {
        load[type] = cpu.times[type] / total;
      }
      loads[i] = load;
    }

    response.top = {
      cpus: loads,
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      uptime: os.uptime(),
      loadavg: os.loadavg(), //. 1, 5, and 15 min's load avg
      timestamp: new Date().getTime(),
    };

    var logPath = path.resolve(sails.config.appPath, 'share', 'load-average.json');
    var logs = [];

    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }

    response.loadavg = logs;

    try {
      if (os.type() !== 'Windows_NT') {
        var model = {
          filesystem: '',
          size: 0,
          used: 0,
          available: 0,
          capacity: 0,
          mount: 'NotFound',
        };

        var res = await diskspacePromise();
        response.diskspace = {
          root: _.extend({}, model, _.find(res, { mount: sails.config.custom.diskspace.root })),
          data: _.extend({}, model, _.find(res, { mount: sails.config.custom.diskspace.data })),
        };
      }
    } catch (err) {
      sails.log.error(err);
    }

    return response;
  },
};
