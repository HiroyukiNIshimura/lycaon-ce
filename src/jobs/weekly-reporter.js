const moment = require('moment');
module.exports = {
  weeklyReport: async function () {
    var dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];
    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    var oneMonthAgo = moment(dt.valueOf()).add(-1, 'months');

    var bot = await sails.helpers.getBot();

    const NATIVE_SQL = `
SELECT a.*
  FROM "thread" a
 WHERE a."id" IN (
  SELECT t."id" FROM (
    SELECT "thread" as "id" , MAX("updatedAt") as "dt"
      FROM "thread_activity"
     WHERE "user" != $1
     GROUP BY "thread") t
      WHERE t.dt <= $2)
   AND a."status" = 0
   AND a."team" = $3
   AND a."local" = false
 ORDER BY a."lastHumanUpdateAt" ASC
`;

    try {
      for (let organization of await Organization.find()) {
        var settings = await SysSettings.findOne({ organization: organization.id });
        if (settings.weeklyReportDay !== dt.getDay()) {
          sails.log.debug(
            `本日[${moment(dt).format('YYYY/MM/DD')}]は、${dayOfWeekStr[settings.weeklyReportDay]}曜日でないので、[${
              organization.handleId
            }] ${organization.name}の週報配信処理をパスします...`
          );
          continue;
        }

        //チームの状況を集計
        var teams = await Team.find({
          organization: organization.id,
          deleted: false,
          isSandbox: false,
        });

        for (let team of teams) {
          //期限切れのもの
          team.orvers = await Thread.find({
            where: {
              status: 0,
              dueDateAt: { '<': dt.valueOf() },
              team: team.id,
              local: false,
            },
            sort: 'dueDateAt ASC',
          }).populate('responsible');

          for (let orver of team.orvers) {
            orver.dueDateFormated = moment(Number(orver.dueDateAt)).format('YYYY/MM/DD') + ' JST';
          }

          //期限まじかのもの
          team.nears = await Thread.find({
            where: {
              status: 0,
              dueDateAt: { '>=': dt.valueOf() },
              team: team.id,
              urgency: { '>=': 1 },
              local: false,
            },
            sort: 'dueDateAt ASC',
          }).populate('responsible');

          for (let near of team.nears) {
            near.dueDateFormated = moment(Number(near.dueDateAt)).format('YYYY/MM/DD') + ' JST';
          }

          //1ヶ月更新のないもの
          var results = await sails.sendNativeQuery(NATIVE_SQL, [bot.id, oneMonthAgo.valueOf(), team.id]);

          team.leaveAlones = results.rows;

          for (let leaveAlones of team.leaveAlones) {
            leaveAlones.updatedAtFormated = moment(Number(leaveAlones.lastHumanUpdateAt)).format('YYYY/MM/DD');

            if (leaveAlones.responsible) {
              leaveAlones.responsible = await User.findOne({
                id: leaveAlones.responsible,
              });
            }
          }

          //件数サマリ
          team.openQty = await Thread.count({ status: 0, team: team.id, local: false });
          team.closeQty = await Thread.count({ status: 1, team: team.id, local: false });
          team.noAsignQty = await Thread.count({
            status: 0,
            responsible: null,
            team: team.id,
            local: false,
          });
          team.totalQty = team.openQty + team.closeQty;
        }

        var users = await User.find({
          organization: organization.id,
          deleted: false,
          isSandbox: false,
        }).populate('teams', {
          where: { deleted: false, isSandbox: false },
        });

        for (let user of users) {
          var lang = user.languagePreference ? user.languagePreference : 'en';
          sails.hooks.i18n.setLocale(lang);
          moment.locale(lang);

          var data = {
            organization: organization,
            to: user.emailAddress,
            toName: user.fullName,
            subject: sails.__('[Lycaon] Weekly Report ({0})').format(moment(dt).format('YYYY/MM/DD')),
            template: 'email-weekly-report',
            templateData: {
              reportDate: moment(dt).format('YYYY/MM/DD') + ' JST',
              teams: [],
              locale: user.languagePreference,
              organization: organization,
            },
          };

          for (let team of user.teams) {
            var exists = _.find(teams, { id: team.id });
            for (let orver of exists.orvers) {
              if (orver.responsible) {
                orver.asignName = orver.responsible.fullName;
                if (orver.responsible.id === user.id) {
                  orver.asignName = orver.asignName + sails.__('(you)');
                }
              }
            }
            for (let near of exists.nears) {
              if (near.responsible) {
                near.asignName = near.responsible.fullName;
                if (near.responsible.id === user.id) {
                  near.asignName = near.asignName + sails.__('(you)');
                }
              }
            }
            for (let leaveAlone of exists.leaveAlones) {
              if (leaveAlone.responsible) {
                leaveAlone.asignName = leaveAlone.responsible.fullName;
                if (leaveAlone.responsible.id === user.id) {
                  leaveAlone.asignName = leaveAlone.asignName + sails.__('(you)');
                }
              }
            }
            data.templateData.teams.push(exists);
          }
          await sails.helpers.sendTemplateEmail.with(data);
        }
      }
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
