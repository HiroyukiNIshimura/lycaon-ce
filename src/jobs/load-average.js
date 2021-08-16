const os = require('os');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

module.exports = {
  //
  sampling: async function () {
    const share = path.resolve(sails.config.appPath, 'share');

    if (!fs.existsSync(share)) {
      fs.mkdirSync(share);
    }

    var logPath = path.join(share, 'load-average.json');

    var logs = [];

    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() - 1);

    logs = _.reject(logs, (m) => {
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
    var logPath = path.resolve(sails.config.appPath, 'share', 'load-average.json');
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
    }
  },
};
