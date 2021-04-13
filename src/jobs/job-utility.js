const path = require('path');
const fs = require('fs');

module.exports = {
  rmdir: function (dir) {
    for (let file of fs.readdirSync(dir)) {
      var filename = path.join(dir, file);
      var stat = fs.statSync(filename);

      if (filename == '.' || filename == '..') {
      } else if (stat.isDirectory()) {
        this.rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  },
};
