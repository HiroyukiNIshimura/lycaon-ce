const log4js = require('log4js');
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/lycaon.log',
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      backups: 10, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      //mode: 0o0640,
      //flags: 'w+',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] %m',
      },
    },
    dateFile: {
      type: 'dateFile',
      filename: 'logs/lycaon-daily.log',
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] %m',
      },
    },
    main: { type: 'logLevelFilter', appender: 'file', level: 'info' },
    daily: { type: 'logLevelFilter', appender: 'dateFile', level: 'debug' },
    out: {
      type: 'stdout',
    },
  },
  categories: {
    default: { appenders: ['main', 'daily', 'out'], level: 'all' },
  },
});

module.exports.log = {
  custom: log4js.getLogger(),
  level: 'trace',
  inspect: false,
};
