/**
 * AvatarUploadController
 * File Upload API
 * from Ajax
 */
//https://github.com/sailshq/machine-as-action#customizing-the-response
const path = require('path');

module.exports = {
  uploadAvatar: async function (req, res) {
    var user = await User.findOne({
      id: req.me.id,
    });
    if (!user) {
      return res.notFound();
    }

    var targetDir = path.resolve(sails.config.appPath, 'avatar', String(user.id));

    //https://github.com/balderdashy/skipper
    req.file('avatar').upload(
      {
        dirname: targetDir,
        maxBytes: req.sysSettings.maxUploadFileSize,
      },
      async function afterUpload(err, uploadedFiles) {
        if (err) {
          if (
            err.code &&
            (err.code === 'E_EXCEEDS_UPLOAD_LIMIT' || err.code === 'E_EXCEEDS_FILE_SIZE_LIMIT')
          ) {
            //size error
            return res.json({
              error: 'EXCEEDS_UPLOAD_LIMIT',
              status: 'error',
            });
          } else {
            sails.log.error(err);
            return res.serverError(err);
          }
        }

        var ext = path.extname(uploadedFiles[0].fd);
        var hashName = path.basename(uploadedFiles[0].fd);
        var extWithout = path.basename(hashName, ext);

        var virtualPath = path.join('avatar', String(user.id), hashName);
        var url = '/avatar/' + String(user.id) + '/' + extWithout + '/' + ext.replace('.', '');

        var item = {
          avatarType: 'user-avatar',
          avatarVirtualPath: virtualPath,
          avatarVirtualUrl: url,
        };

        await sails.getDatastore().transaction(async (db) => {
          await User.updateOne({
            id: user.id,
          })
            .set(item)
            .usingConnection(db);

          sails.log.debug('添付ファイルを登録しました。');

          return res.json({
            data: item,
            status: 'success',
          });
        });
      }
    );
  },
};
