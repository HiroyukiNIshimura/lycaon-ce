const path = require('path');
const fs = require('fs');
const admZip = require('adm-zip');
const utility = require('./job-utility');

module.exports = {
  backup: async function () {
    try {
      if (!sails.config.custom.backup.autoDbBackup) {
        sails.log.info('自動バックアップがOFFのためバックアップ処理は実行しません...');
        return 'skip';
      }

      var zip = new admZip();
      var dt = new Date();
      const backupDir = path.resolve(sails.config.appPath, 'backup');

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      var workdir = path.resolve(backupDir, `${dt.valueOf()}`);
      if (!fs.existsSync(workdir)) {
        fs.mkdirSync(workdir);
      }

      var numstr = ('00000000000000' + dt.valueOf()).slice(-14);
      var zipFile = path.resolve(backupDir, `backup-${numstr}.zip`);

      for (let identity in sails.models) {
        var entityFile = path.resolve(workdir, `${identity}-${numstr}`);
        //
        var i = 1;
        var limit = 500;
        var model = sails.models[identity];
        model.customToJSON = undefined;

        try {
          await model.count();
        } catch (err) {
          sails.log.info(err);
          continue;
        }

        await model
          .stream()
          .meta({
            skipAllLifecycleCallbacks: true,
            skipRecordVerification: true,
            decrypt: true,
            skipExpandingDefaultSelectClause: true,
          })
          .sort('id ASC')
          .eachBatch(limit, async (records) => {
            //
            var dumpfile = entityFile + `-${i}.dump`;
            var data = JSON.stringify(records);
            fs.appendFileSync(dumpfile, data);
            zip.addLocalFile(dumpfile);
            i++;
          });
      }

      zip.writeZip(zipFile);

      for (var file of fs.readdirSync(workdir)) {
        fs.unlinkSync(path.resolve(workdir, file));
      }
      fs.rmdirSync(workdir);

      sails.log.info(`バックアップファイルを作成しました。${zipFile}`);

      var maxfiles = sails.config.custom.backup.dbBackupStocks;

      var list = fs.readdirSync(backupDir).map((filename) => {
        var stat = fs.statSync(path.join(backupDir, filename));
        if (!stat.isDirectory()) {
          return {
            filename: filename,
            mtime: fs.statSync(path.join(backupDir, filename)).mtime.valueOf(),
          };
        }
        return false;
      });
      list = _.reject(list, (e) => {
        return !e;
      });
      list.sort((a, b) => a.mtime - b.mtime);

      if (list.length > maxfiles) {
        for (let i = 0; i < list.length - maxfiles; i++) {
          fs.unlinkSync(path.resolve(backupDir, list[i].filename));
          sails.log.info(`古いバックアップファイルを削除しました。${list[i].filename}`);
        }
      }

      return zipFile;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
  recovery: async function (zipFile) {
    if (!zipFile) {
      throw 'Parameter is required!';
    }
    try {
      var dt = new Date();

      var backupDir = path.resolve(sails.config.appPath, 'backup');
      var workdir = path.resolve(backupDir, `${dt.valueOf()}`);
      if (!fs.existsSync(workdir)) {
        fs.mkdirSync(workdir);
      }

      var zip = new admZip(path.join(backupDir, zipFile));
      zip.extractAllTo(workdir, true);

      var extracet = path.basename(zipFile, path.extname(zipFile));
      var dir = path.join(workdir, extracet);
      if (!fs.existsSync(dir)) {
        dir = workdir;
      }

      var dumps = fs.readdirSync(dir);
      await sails.getDatastore().transaction(async (db) => {
        for (let identity in sails.models) {
          var exists = _.filter(dumps, (o) => {
            return o.startsWith(`${identity}-`);
          });

          await sails.models[identity].destroy({}).meta({ cascade: false }).usingConnection(db);

          for (let dump of exists) {
            var json = fs.readFileSync(path.resolve(dir, dump), 'utf8');
            var list = JSON.parse(json);

            try {
              await sails.models[identity].createEach(list).usingConnection(db);
              sails.log.info(`ロード...${identity} ${dump}`);
            } catch (err) {
              //
              sails.log.error(err);
              throw err;
            }
          }

          var data = await sails.models[identity].find({ limit: 1, skip: 0, sort: 'id DESC' }).usingConnection(db);
          if (data.length > 0) {
            var current = data[0].id + 1;
            var seqSql = `SELECT setval('"public"."${sails.models[identity].tableName}_id_seq"', $1, false)`;
            await sails.sendNativeQuery(seqSql, [current]).usingConnection(db);
          }
        }
        //
      });

      var orgs = await Organization.find();
      for (let org of orgs) {
        await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_thread_${org.handleId}";`);
        await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_wiki_${org.handleId}";`);

        let thread = await Thread.find({
          where: { handleId: org.handleId },
          sort: 'no DESC',
          limit: 1,
          skip: 0,
        });

        if (thread.length > 0) {
          await sails.sendNativeQuery(
            `CREATE SEQUENCE IF NOT EXISTS "org_thread_${org.handleId}" START ${thread[0].no + 1};`
          );
        } else {
          await sails.sendNativeQuery(`CREATE SEQUENCE IF NOT EXISTS "org_thread_${org.handleId}" START 1;`);
        }

        let wiki = await Wiki.find({
          where: { handleId: org.handleId },
          sort: 'no DESC',
          limit: 1,
          skip: 0,
        });

        if (wiki.length > 0) {
          await sails.sendNativeQuery(
            `CREATE SEQUENCE IF NOT EXISTS "org_wiki_${org.handleId}" START ${wiki[0].no + 1};`
          );
        } else {
          await sails.sendNativeQuery(`CREATE SEQUENCE IF NOT EXISTS "org_wiki_${org.handleId}" START 1;`);
        }
      }

      utility.rmdir(workdir);

      sails.log.info(`データベースをリカバリしました。${zipFile}`);
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
