/**
 * UploadFileController
 * File Upload API
 * from Ajax
 */
//https://github.com/sailshq/machine-as-action#customizing-the-response
const path = require('path');
const fs = require('fs');
const jimp = require('jimp');

module.exports = {
  /**
   *
   * @param {type, id} req
   * @param {x-blobUrl?} header
   * @param {*} res
   */
  upload: async function (req, res) {
    if (!req.params.type || !req.params.id) {
      return res.badRequest();
    }

    var user = await User.findOne({
      id: req.me.id,
    });
    if (!user) {
      return res.notFound();
    }

    var blobSize = req.headers['x-blobsize'];

    var virtualDir = '';
    var thread = {};
    var wiki = {};
    var vote = {};
    var team = {};

    if (req.params.type === 'thread' || req.params.type === 'createthread') {
      thread = await Thread.findOne({
        id: req.params.id,
      });
      if (!thread) {
        return res.notFound();
      }

      team = await sails.helpers.validateMembership.with({
        id: thread.team,
        user: req.me,
      });
      if (!team) {
        return res.notFound();
      }

      let valid = await sails.helpers.planing.planingThread.with({
        organization: user.organization,
        thread: thread,
        appendSize: blobSize,
      });

      if (!valid.valid) {
        return res.json({
          error: valid.error,
          status: 'error',
        });
      }

      virtualDir = path.join('appendix', 'thread', String(req.params.id));
    } else if (req.params.type === 'wiki' || req.params.type === 'createwiki') {
      wiki = await Wiki.findOne({
        id: req.params.id,
      });
      if (!wiki) {
        return res.notFound();
      }

      if (wiki.concept === 0) {
        team = await sails.helpers.validateMembership.with({
          id: wiki.team,
          user: req.me,
        });
        if (!team) {
          return res.notFound();
        }
      } else {
        if (!req.me.isSuperAdmin) {
          res.forbidden();
        }
      }

      let valid = await sails.helpers.planing.planingWiki.with({
        organization: user.organization,
        wiki: wiki,
        appendSize: blobSize,
      });

      if (!valid.valid) {
        return res.json({
          error: valid.error,
          status: 'error',
        });
      }

      virtualDir = path.join('appendix', 'wiki', String(req.params.id));
    } else if (req.params.type === 'vote' || req.params.type === 'createvote') {
      vote = await Vote.findOne({
        id: req.params.id,
      });
      if (!vote) {
        return res.notFound();
      }

      if (user.organization !== vote.organization) {
        return res.notFound();
      }

      let valid = await sails.helpers.planing.planingVote.with({
        organization: user.organization,
        vote: vote,
        appendSize: blobSize,
      });

      if (!valid.valid) {
        return res.json({
          error: valid.error,
          status: 'error',
        });
      }

      virtualDir = path.join('appendix', 'vote', String(req.params.id));
    } else {
      return res.badRequest();
    }

    var bloburl = req.headers['x-bloburl'];

    //https://github.com/balderdashy/skipper
    req.file('appendix').upload(
      {
        dirname: path.resolve(sails.config.appPath, virtualDir),
        maxBytes: req.sysSettings.maxUploadFileSize,
      },
      async function afterUpload(err, uploadedFiles) {
        //
        var renameBolburl = async function (bloburl, url, db) {
          var escaped = await sails.helpers.regexEscape.with({ str: bloburl });

          if (req.params.type === 'createthread' && bloburl) {
            let regex = new RegExp(escaped, 'g');
            let newbody = thread.body.replace(regex, url);
            if (newbody !== thread.body) {
              await Thread.updateOne({ id: req.params.id })
                .set({
                  body: newbody,
                })
                .usingConnection(db);
            }
          }

          if (req.params.type === 'createwiki' && bloburl) {
            let regex = new RegExp(escaped, 'g');
            let newbody = wiki.body.replace(regex, url);
            if (newbody !== wiki.body) {
              await Wiki.updateOne({ id: req.params.id })
                .set({
                  body: newbody,
                })
                .usingConnection(db);
            }
          }

          if (req.params.type === 'createvote' && bloburl) {
            let regex = new RegExp(escaped, 'g');
            let newbody = vote.body.replace(regex, url);
            if (newbody !== vote.body) {
              await Vote.updateOne({ id: req.params.id })
                .set({
                  body: newbody,
                })
                .usingConnection(db);
            }
          }
        };

        if (err) {
          if (err.code && (err.code === 'E_EXCEEDS_UPLOAD_LIMIT' || err.code === 'E_EXCEEDS_FILE_SIZE_LIMIT')) {
            //size error
            await sails.getDatastore().transaction(async (db) => {
              await renameBolburl(bloburl, sails.__('Upload error'), db);
            });
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

        var virtualPath = path.join(virtualDir, hashName);

        var url = '';
        var urlM = '';
        var urlS = '';
        if (req.params.type === 'thread' || req.params.type === 'createthread') {
          url = `/appendix/thread/${req.params.id}/L/${extWithout}/${ext.replace('.', '')}`;
          urlM = `/appendix/thread/${req.params.id}/M/${extWithout}/${ext.replace('.', '')}`;
          urlS = `/appendix/thread/${req.params.id}/S/${extWithout}/${ext.replace('.', '')}`;
        } else if (req.params.type === 'wiki' || req.params.type === 'createwiki') {
          if (wiki.concept === 0) {
            url = `/appendix/wiki/${req.params.id}/L/${extWithout}/${ext.replace('.', '')}`;
            urlM = `/appendix/wiki/${req.params.id}/M/${extWithout}/${ext.replace('.', '')}`;
            urlS = `/appendix/wiki/${req.params.id}/S/${extWithout}/${ext.replace('.', '')}`;
          } else {
            url = `/entrance/wiki/${req.params.id}/L/${extWithout}/${ext.replace('.', '')}`;
            urlM = `/entrance/wiki/${req.params.id}/M/${extWithout}/${ext.replace('.', '')}`;
            urlS = `/entrance/wiki/${req.params.id}/S/${extWithout}/${ext.replace('.', '')}`;
          }
        } else if (req.params.type === 'vote' || req.params.type === 'createvote') {
          url = `/appendix/vote/${req.params.id}/L/${extWithout}/${ext.replace('.', '')}`;
          urlM = `/appendix/vote/${req.params.id}/M/${extWithout}/${ext.replace('.', '')}`;
          urlS = `/appendix/vote/${req.params.id}/S/${extWithout}/${ext.replace('.', '')}`;
        } else {
          return res.badRequest();
        }

        var item = {
          name: uploadedFiles[0].filename,
          virtualPath: virtualPath,
          virtualPathMid: path.join(virtualDir, 'thum_m', hashName),
          virtualPathSmall: path.join(virtualDir, 'thum_s', hashName),
          virtualUrl: url,
          virtualUrlMid: urlM,
          virtualUrlSmall: urlS,
          hashName: hashName,
          size: uploadedFiles[0].size,
          mimeType: uploadedFiles[0].type,
          owner: user.id,
        };

        var mimes = ['image/bmp', 'image/jpeg', 'image/png'];
        if (_.indexOf(mimes, item.mimeType) > -1) {
          try {
            var mDir = path.join(virtualDir, 'thum_m');
            var sDir = path.join(virtualDir, 'thum_s');
            if (!fs.existsSync(mDir)) {
              fs.mkdirSync(mDir);
            }
            if (!fs.existsSync(sDir)) {
              fs.mkdirSync(sDir);
            }

            const mSizeWidth = sails.config.custom.thumbnail.mSizeWidth;
            const sSizeWidth = sails.config.custom.thumbnail.sSizeWidth;

            let image = await jimp.read(path.resolve(sails.config.appPath, item.virtualPath));
            let width = image.bitmap.width;
            if (width > mSizeWidth) {
              await image.resize(mSizeWidth, jimp.AUTO);
              await image.writeAsync(path.resolve(sails.config.appPath, item.virtualPathMid));
            }

            if (width > sSizeWidth) {
              await image.resize(sSizeWidth, jimp.AUTO);
              await image.writeAsync(path.resolve(sails.config.appPath, item.virtualPathSmall));
            }
          } catch (err) {
            sails.log.error(err);
          }
        }

        if (req.params.type === 'thread' || req.params.type === 'createthread') {
          item.thread = req.params.id;
        } else if (req.params.type === 'wiki' || req.params.type === 'createwiki') {
          item.wiki = req.params.id;
        } else if (req.params.type === 'vote' || req.params.type === 'createvote') {
          item.vote = req.params.id;
        } else {
          return res.badRequest();
        }

        await sails.getDatastore().transaction(async (db) => {
          var createdRecord = {};

          var container = 'thread';
          if (req.params.type === 'thread' || req.params.type === 'createthread') {
            createdRecord = await ThreadItem.create(item).fetch().usingConnection(db);
            await sails.helpers.storage.createThreadActivity.with({
              db: db,
              type: 'attach-file',
              user: user,
              thread: thread,
              fileName: item.name,
            });
          } else if (req.params.type === 'wiki' || req.params.type === 'createwiki') {
            createdRecord = await WikiItem.create(item).fetch().usingConnection(db);
            container = 'wiki';
          } else if (req.params.type === 'vote' || req.params.type === 'createvote') {
            createdRecord = await VoteItem.create(item).fetch().usingConnection(db);
            container = 'vote';
          } else {
            return res.badRequest();
          }

          await renameBolburl(bloburl, url, db);

          await User.setGravatarUrl(user, 36);
          createdRecord.owner = user;
          sails.log.debug(`添付ファイルを登録しました。${virtualPath}`);

          await sails.helpers.agendaSchedule.with({
            ttl: Date.now() + sails.config.custom.documentTokenizeTTL,
            job: 'document-tokenize',
            data: {
              type: container,
              item: createdRecord,
            },
          });

          return res.json({
            item: createdRecord,
            url: url,
            urlMid: urlM,
            urlSmall: urlS,
            status: 'success',
          });
        });
      }
    );
  },
  /**
   *
   * @param {type, id, fileId} req
   * @param {*} res
   */
  destroy: async function (req, res) {
    if (!req.params.type || !req.params.id || !req.params.fileId) {
      return res.badRequest();
    }

    var user = await User.findOne({
      id: req.me.id,
    });
    if (!user) {
      return res.notFound();
    }

    var item = {};
    var team = {};

    if (req.params.type === 'thread') {
      var thread = await Thread.findOne({
        id: req.params.id,
      });
      if (!thread) {
        return res.notFound();
      }

      team = await sails.helpers.validateMembership.with({
        id: thread.team,
        user: req.me,
      });
      if (!team) {
        return res.notFound();
      }

      item = await ThreadItem.findOne({
        id: req.params.fileId,
      });

      if (item) {
        await sails.getDatastore().transaction(async (db) => {
          await ThreadItem.destroyOne({
            id: item.id,
          }).usingConnection(db);

          await sails.helpers.storage.createThreadActivity.with({
            db: db,
            type: 'delete-file',
            user: req.me,
            thread: thread,
            fileName: item.name,
          });
        });
      }
    } else if (req.params.type === 'wiki') {
      var wiki = await Wiki.findOne({
        id: req.params.id,
      });
      if (!wiki) {
        return res.notFound();
      }

      if (wiki.concept === 0) {
        team = await sails.helpers.validateMembership.with({
          id: wiki.team,
          user: req.me,
        });
        if (!team) {
          return res.notFound();
        }
      } else {
        if (!req.me.isSuperAdmin) {
          res.forbidden();
        }
      }

      item = await WikiItem.findOne({
        id: req.params.fileId,
      });

      if (item) {
        await sails.getDatastore().transaction(async (db) => {
          await WikiItem.destroyOne({
            id: item.id,
          }).usingConnection(db);
        });
      }
    } else {
      var vote = await Vote.findOne({
        id: req.params.id,
      });
      if (!vote) {
        return res.notFound();
      }

      if (user.organization !== vote.organization) {
        return res.notFound();
      }

      item = await VoteItem.findOne({
        id: req.params.fileId,
      });

      if (item) {
        await sails.getDatastore().transaction(async (db) => {
          await VoteItem.destroyOne({
            id: item.id,
          }).usingConnection(db);
        });
      }
    }

    if (item) {
      try {
        let target = path.resolve(sails.config.appPath, item.virtualPath);
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
          sails.log.debug(`添付ファイル(L)を削除しました。${target}`);
        }
      } catch (err) {
        //無視
        sails.log.error(err);
      }

      try {
        let target = path.resolve(sails.config.appPath, item.virtualPathMid);
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
          sails.log.debug(`添付ファイル(M)を削除しました。${target}`);
        }
      } catch (err) {
        //無視
        sails.log.error(err);
      }

      try {
        let target = path.resolve(sails.config.appPath, item.virtualPathSmall);
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
          sails.log.debug(`添付ファイル(S)を削除しました。${target}`);
        }
      } catch (err) {
        //無視
        sails.log.error(err);
      }
      return res.json({
        message: 'deleteed file(s) successfully!',
        status: 'success',
      });
    }

    return res.json({
      message: 'delete file(s) notfound',
      status: 'success',
    });
  },
};
