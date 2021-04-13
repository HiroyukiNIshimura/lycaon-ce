const os = require('os');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

module.exports = {
  //
  sampling: async function () {
    var logPath = path.resolve(sails.config.appPath, 'logs', 'load-average.json');

    var logs = [];

    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() - 1);

    logs = _.reject(logs, function (m) {
      return m.timestamp < dt.valueOf();
    });

    var cdate = new Date();

    logs.push({
      hour: moment(cdate).format('MM/DD HH:mm'),
      timestamp: cdate.valueOf(),
      loadAverage: os.loadavg(),
    });

    fs.writeFileSync(logPath, JSON.stringify(logs));
  },
  destroy: function () {
    var logPath = path.resolve(sails.config.appPath, 'logs', 'load-average.json');
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
    }
  },
};
