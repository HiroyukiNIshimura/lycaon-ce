const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   *
   * @param {type, id} req
   * @param {x-blobUrl?} header
   * @param {*} res
   */
  upload: async function (req, res) {
    const backupDir = path.resolve(sails.config.appPath, 'backup');

    //https://github.com/balderdashy/skipper
    req.file('backup').upload(
      {
        dirname: backupDir,
      },
      async function afterUpload(err, uploadedFiles) {
        if (err) {
          if (
            err.code &&
            (err.code === 'E_EXCEEDS_UPLOAD_LIMIT' || err.code === 'E_EXCEEDS_FILE_SIZE_LIMIT')
          ) {
            return res.json({
              error: 'EXCEEDS_UPLOAD_LIMIT',
              status: 'error',
            });
          } else {
            sails.log.error(err);
            return res.serverError(err);
          }
        }

        var hashName = path.basename(uploadedFiles[0].fd);
        var org = uploadedFiles[0].filename;

        await fs.renameSync(path.join(backupDir, hashName), path.join(backupDir, org));

        return res.json({
          status: 'success',
        });
      }
    );
  },
};
