const path = require('path');
const fs = require('fs');

module.exports = {
  friendlyName: 'View list',

  description: 'Display "List" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/backoffice/backup/list',
    },
  },

  fn: async function () {
    var backupDir = path.resolve(sails.config.appPath, 'backup');

    var list = fs.readdirSync(backupDir).map((filename) => {
      var stat = fs.statSync(path.join(backupDir, filename));
      if (!stat.isDirectory()) {
        return {
          filename: filename,
          mtime: fs.statSync(path.join(backupDir, filename)).mtime.valueOf(),
          utc: filename.replace('backup-', '').replace('.zip', ''),
        };
      }
      return false;
    });
    list = _.reject(list, (e) => {
      return !e;
    });
    list.sort((a, b) => Number(a.utc) - Number(b.utc));

    var message;
    if (this.req.session.effectMessage) {
      message = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    return { backups: list, effectMessage: message };
  },
};
