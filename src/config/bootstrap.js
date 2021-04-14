/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const moment = require("moment");
//https://github.com/agenda/agenda
const Agenda = require("agenda");

const gitlogging = require("../jobs/git-logging");
const dbdumper = require("../jobs/db-dump");
const migrator = require("../jobs/db-migration");
const urgency = require("../jobs/update-urgency");
const reporter = require("../jobs/weekly-reporter");
const cleaner = require("../jobs/data-cleaning");
const unsubscribed = require("../jobs/unsubscribed");
const recommendation = require("../jobs/freeplan-access-check");
const votemail = require("../jobs/vote-mail-send");
const similarity = require("../jobs/similarity-bot");
const notification = require("../jobs/sys-notification");
const loadAverage = require("../jobs/load-average");

module.exports.bootstrap = async function () {
  //自動マイグレーション
  if (process.env.DB_MIGRATION) {
    await migrator.migration();
  }

  // create seed data
  var seed = async function () {
    await sails.sendNativeQuery("CREATE EXTENSION IF NOT EXISTS pg_bigm");
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "thread_subject" ON "thread" USING gin (subject gin_bigm_ops)'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "thread_body" ON "thread" USING gin (body gin_bigm_ops)'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "wiki_subject" ON "wiki" USING gin (subject gin_bigm_ops)'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "wiki_body" ON "wiki" USING gin (body gin_bigm_ops)'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "sneeze_comment" ON "sneeze" USING gin (comment gin_bigm_ops)'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "reply_comment" ON "reply" USING gin (comment gin_bigm_ops)'
    );

    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "idx_thread_no" ON "thread" ("no", "handleId");'
    );
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "idx_wiki_no" ON "wiki" ("no", "handleId");'
    );
    /*
    await sails.sendNativeQuery(
      'CREATE INDEX IF NOT EXISTS "idx_user_login_key" ON "user" ("emailAddress", "deleted", "isNologin");'
    );
*/
    if (!(await SysStatus.findOne({ id: 1 }))) {
      await SysStatus.create({
        id: 1,
        version: "0.0.0",
      });
    }
    await SysStatus.updateOne({ id: 1 }).set({
      systemLiftAt: Date.now(),
    });

    if (!(await Policy.findOne({ id: 1 }))) {
      var doc = path.resolve(sails.config.appPath, "views", "pages", "doc");
      await Policy.create({
        id: 1,
        user: fs.readFileSync(path.join(doc, "user-policy.ejs"), "utf8"),
        userAt: Date.now(),
        privacy: fs.readFileSync(path.join(doc, "privacy-policy.ejs"), "utf8"),
        privacyAt: Date.now(),
      });
    }

    var copyicon = function (bot) {
      var src = path.resolve(
        sails.config.appPath,
        "assets",
        "images",
        "lycaonbot.jpg"
      );
      var dir = path.resolve(sails.config.appPath, "avatar", String(bot.id));

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      var read = fs.createReadStream(src);
      var write = fs.createWriteStream(path.join(dir, "lycaonbot.jpg"));
      read.pipe(write);
    };

    var bot = await User.findOne({
      emailAddress: "lycaonbot@example.com",
      fullName: "lycaonbot",
      isNologin: true,
      isSandbox: true,
    });

    if (!bot) {
      bot = await User.create({
        emailAddress: "lycaonbot@example.com",
        fullName: "lycaonbot",
        isNologin: true,
        isSandbox: true,
        skil:
          "You may be able to help the team a little by letting me join the team. 私をチームに参加させることで少しだけチームのお手伝いができるかもしれません。",
        avatarType: "user-avatar",
        password: await sails.helpers.createPassword.with(),
      }).fetch();

      copyicon(bot);
      await User.updateOne({ id: bot.id }).set({
        avatarVirtualPath: `avatar/${bot.id}/lycaonbot.jpg`,
        avatarVirtualUrl: `/avatar/${bot.id}/lycaonbot/jpg`,
      });

      await SysStatus.updateOne({ id: 1 }).set({
        botid: bot.id,
      });
    } else {
      copyicon(bot);
      await User.updateOne({ id: bot.id }).set({
        avatarVirtualPath: `avatar/${bot.id}/lycaonbot.jpg`,
        avatarVirtualUrl: `/avatar/${bot.id}/lycaonbot/jpg`,
      });
      await SysStatus.updateOne({ id: 1 }).set({
        botid: bot.id,
      });
    }

    if ((await Organization.count({ handleId: "example" })) < 1) {
      await sails.helpers.createSequence.with({ handleId: "example" });

      let org = await Organization.create({
        handleId: "example",
        name: "example organization",
        emailAddress: "foo@example.com",
        fullName: "foo example",
        plan: "example",
        isBackOffice: true,
      }).fetch();

      await Billing.create({ organization: org.id });

      await SysSettings.create({
        internalEmailAddress: "support@example.com",
        fromEmailAddress: "support@example.com",
        fromName: "Team Example",
        organization: org.id,
        maxUploadFileSize: 1024 * 1024 * 500,
      });

      let createdUsers = await User.createEach([
        {
          emailAddress: "foo@example.com",
          fullName: "foo example",
          isSuperAdmin: true,
          password: await bcrypt.hash("P@ssw0rd", 10),
          organization: org.id,
        },
      ]).fetch();

      var team = await Team.create({
        name: "Team Example",
        description: "BackOffice",
        users: createdUsers.map((obj) => obj.id),
        organization: org.id,
      }).fetch();

      await Category.createEach([
        {
          name: "Issues",
          displayOrder: 1,
          organization: org.id,
          teams: [team.id],
        },
        {
          name: "Bugtrack",
          displayOrder: 2,
          organization: org.id,
          teams: [team.id],
        },
      ]);
    }
  };

  try {
    await seed();
    sails.log.info("シードデータを作成しました。");
  } catch (err) {
    sails.log.error(err);
    throw err;
  }

  //agendaを利用したJOBの起動
  try {
    var agenda = new Agenda({
      db: {
        address: sails.config.custom.agenda.mongoUrl,
        collection: sails.config.custom.agenda.collection,
        options: sails.config.custom.agenda.options,
      },
    });
    agenda.processEvery("30 seconds");

    /**
     * gitログとのシンク
     */
    agenda.define(
      sails.config.custom.agenda.jobs.gitLogUpdate.name,
      async (job) => {
        await gitlogging.sync();
      }
    );

    /**
     * DBバックアップ
     */
    agenda.define(
      sails.config.custom.agenda.jobs.dbBackup.name,
      async (job) => {
        job.attrs.data = { result: await dbdumper.backup() };
      }
    );

    /**
     * 緊急度更新
     */
    agenda.define(sails.config.custom.agenda.jobs.urgency.name, async (job) => {
      job.attrs.data = { result: await urgency.findAndUpdate() };
    });

    /**
     * 週次報告
     */
    agenda.define(
      sails.config.custom.agenda.jobs.weeklyreport.name,
      async (job) => {
        await reporter.weeklyReport();
      }
    );

    /**
     * システムからのお知らせ
     */
    agenda.define(
      sails.config.custom.agenda.jobs.sysNotification.name,
      async (job) => {
        job.attrs.data = { result: await notification.sendMail() };
      }
    );

    /**
     * 不要データ削除
     */
    agenda.define(
      sails.config.custom.agenda.jobs.dataCleaning.name,
      async (job) => {
        await cleaner.clean();
      }
    );

    /**
     * 退会処理
     */
    agenda.define(
      sails.config.custom.agenda.jobs.unsubscribed.name,
      async (job) => {
        job.attrs.data = { result: await unsubscribed.stateChange() };
      }
    );

    /**
     * 未使用に対する退会勧告メール
     */
    agenda.define(
      sails.config.custom.agenda.jobs.recommendation.name,
      async (job) => {
        job.attrs.data = { result: await recommendation.recommendation() };
      }
    );

    /**
     * 回覧公開メール
     */
    agenda.define(
      sails.config.custom.agenda.jobs.votemail.name,
      async (job) => {
        await votemail.releaseMail();
      }
    );

    /**
     * load average
     */
    agenda.define(
      sails.config.custom.agenda.jobs.loadAverage.name,
      async (job) => {
        await loadAverage.sampling();
      }
    );

    /**
     * メール送信
     */
    agenda.define(
      "send-email",
      { priority: "high", concurrency: 20 },
      async (job) => {
        await sails.helpers.sendTemplateEmail.with(job.attrs.data);
      }
    );

    /**
     * 類似スレッド検索
     */
    agenda.define(
      "similarity-bot",
      { priority: "high", concurrency: 20 },
      async (job) => {
        job.attrs.data = {
          result: await similarity.similarityCheck(job.attrs.data),
        };
      }
    );

    //agenda events
    agenda.on("start", (job) => {
      sails.log.info(`[${job.attrs.name}] ジョブを開始します...`);
    });
    agenda.on("fail", async (err, job) => {
      await sails.helpers.writeJobLog.with({
        jobName: job.attrs.name,
        runAt: moment(job.attrs.lastRunAt).valueOf(),
        result: "error",
      });
      sails.log.error({
        message: `[${job.attrs.name}] ジョブでエラーが発生しました`,
        error: err,
      });

      if (
        job.attrs.name === "send-email" ||
        job.attrs.name === "similarity-bot"
      ) {
        await job.remove();
      }
    });
    agenda.on("success", async (job) => {
      var result = "success";

      if (job.attrs.data && job.attrs.data.result) {
        result = job.attrs.data.result;
      }

      sails.log.info({
        message: `[${job.attrs.name}] ジョブが完了しました`,
        result: result,
      });

      if (
        job.attrs.name === "send-email" ||
        job.attrs.name === "similarity-bot"
      ) {
        await job.remove();
      }
    });

    //
    (async function () {
      await agenda.start();

      //既に実行済みのJOBを削除
      var jobs = await agenda.jobs({ lastRunAt: { $exists: true } });
      for (let job of jobs) {
        await job.remove();
      }

      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.gitLogUpdate.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.dbBackup.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.urgency.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.votemail.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.weeklyreport.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.sysNotification.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.unsubscribed.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.recommendation.name,
      });
      await agenda.cancel({
        name: sails.config.custom.agenda.jobs.loadAverage.name,
      });

      await agenda.every(
        sails.config.custom.agenda.jobs.gitLogUpdate.every,
        sails.config.custom.agenda.jobs.gitLogUpdate.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.dbBackup.every,
        sails.config.custom.agenda.jobs.dbBackup.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.urgency.every,
        sails.config.custom.agenda.jobs.urgency.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.votemail.every,
        sails.config.custom.agenda.jobs.votemail.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.weeklyreport.every,
        sails.config.custom.agenda.jobs.weeklyreport.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.sysNotification.every,
        sails.config.custom.agenda.jobs.sysNotification.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.unsubscribed.every,
        sails.config.custom.agenda.jobs.unsubscribed.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.recommendation.every,
        sails.config.custom.agenda.jobs.recommendation.name
      );
      await agenda.every(
        sails.config.custom.agenda.jobs.loadAverage.every,
        sails.config.custom.agenda.jobs.loadAverage.name
      );
    })();
    //
  } catch (err) {
    sails.log.error(err);
    throw err;
  }

  async function genClassifier() {
    var dclassify = require("dclassify");
    var kuromojin = require("kuromojin");

    // Utilities provided by dclassify
    var Classifier = dclassify.Classifier;
    var DataSet = dclassify.DataSet;
    var Document = dclassify.Document;

    sails.log.debug("エモーション辞書作成...");

    var emos = ["happy", "surprise", "fear", "sad", "anger", "hatred", "shame"];
    var dicDir = path.resolve(sails.config.appPath, "config", "emos");

    var data = new DataSet();

    var i = 1;
    for (let emo of emos) {
      var dicfile = path.join(dicDir, `${emo}.dat`);
      if (fs.existsSync(dicfile)) {
        var samples = [];
        var dic = fs.readFileSync(dicfile, "utf-8");
        for (let line of dic.split("\n")) {
          var tokens = await kuromojin.tokenize(line.trim());

          var map = [];
          for (let o of tokens) {
            if (o.pos === "記号" && o.pos_detail_1 !== "一般") {
              continue;
            }
            map.push(o.surface_form);
          }
          samples.push(new Document(`item-${i}`, map));
          i++;
        }
        data.add(emo, samples);
        sails.log.debug(emo + " 辞書ロード...");
      }
    }

    var classifier = new Classifier({
      applyInverse: false,
    });
    classifier.train(data);
    sails.log.debug("Classifier trained.");

    return classifier;
  }

  sails.config.custom.classifier = await genClassifier();

  if (process.env.NODE_ENV === "production") {
    var revfile = path.resolve(sails.config.appPath, "git-current.rev");
    if (fs.existsSync(revfile)) {
      var rev = fs.readFileSync(revfile, "utf-8");
      await SysStatus.updateOne({ id: 1 }).set({
        version: rev.trim(),
      });
    }
  }

  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 0;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(
    sails.config.appPath,
    ".tmp/bootstrap-version.json"
  );

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (
    sails.config.models.migrate !== "drop" &&
    sails.config.environment !== "test"
  ) {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (
      process.env.NODE_ENV === "production" ||
      sails.config.models.migrate === "safe"
    ) {
      sails.log(
        "Since we are running with migrate: 'safe' and/or NODE_ENV=production (in the \"" +
          sails.config.environment +
          '" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...'
      );
      return;
    } //•

    if (process.env.NODE_ENV === "staging") {
      sails.log(
        'Since we are running with NODE_ENV=staging (in the "' +
          sails.config.environment +
          '" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...'
      );
      return;
    } //•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs
      .readJson(bootstrapLastRunInfoPath)
      .tolerate("doesNotExist"); // (it's ok if the file doesn't exist yet-- just keep going.)

    if (
      lastRunBootstrapInfo &&
      lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION
    ) {
      sails.log(
        "Skipping v" +
          HARD_CODED_DATA_VERSION +
          " bootstrap script...  (because it's already been run)"
      );
      sails.log(
        "(last run on this computer: @ " +
          new Date(lastRunBootstrapInfo.lastRunAt) +
          ")"
      );
      return;
    } //•

    sails.log(
      "Running v" +
        HARD_CODED_DATA_VERSION +
        " bootstrap script...  (" +
        (lastRunBootstrapInfo
          ? "before this, the last time the bootstrap ran on this computer was for v" +
            lastRunBootstrapInfo.lastRunVersion +
            " @ " +
            new Date(lastRunBootstrapInfo.lastRunAt)
          : "looks like this is the first time the bootstrap has run on this computer") +
        ")"
    );
  } else {
    sails.log(
      "Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)"
    );
  }

  // Since the hard-coded data version has been incremented, and we're running in
  // a "throwaway data" environment, delete all records from all models.
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
    var seqSql = `SELECT setval('"public"."${sails.models[identity].tableName}_id_seq"', $1, false)`;
    await sails.sendNativeQuery(seqSql, [1]);
  } //∞

  if (sails.config.models.migrate === "drop") {
    await seed();
  }

  // Save new bootstrap version
  await sails.helpers.fs.writeJson
    .with({
      destination: bootstrapLastRunInfoPath,
      json: {
        lastRunVersion: HARD_CODED_DATA_VERSION,
        lastRunAt: Date.now(),
      },
      force: true,
    })
    .tolerate((err) => {
      sails.log.warn(
        "For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `" +
          sails.config.appPath +
          "`.  Full error details: " +
          err.stack +
          "\n\n(Proceeding anyway this time...)"
      );
    });
};
