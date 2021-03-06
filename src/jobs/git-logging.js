/*
 git log utility

 https://www.npmjs.com/package/simple-git
 */

const moment = require('moment');
const axios = require('axios');
const crypto = require('crypto');

module.exports = {
  sync: async function () {
    var valueSets = [];

    var NATIVE_SQL = `
DELETE FROM "git_log"
 WHERE "id" NOT IN (SELECT "min_id" from (SELECT MIN("id") "min_id" FROM "git_log" WHERE "team" = $1 GROUP BY "hash") tmp)
   AND "team" = $2
`;

    for (let team of await Team.find({ deleted: false })) {
      if (!team.useGit) {
        await GitLog.destroy({
          where: { team: team.id },
        });
        continue;
      }

      sails.log.info(`チーム[${team.id}]のgitログ収集を開始します...`);

      var repositoryHash = '';
      if (team.connectType === 0) {
        repositoryHash = crypto
          .createHash('sha256')
          .update(`${team.connectType}|${team.gitUser}|${team.gitRepository}`)
          .digest('hex');
      } else {
        repositoryHash = crypto
          .createHash('sha256')
          .update(`${team.connectType}|${team.gitlabApi}|${team.gitlabProjectId}|${team.gitOrigin}`)
          .digest('hex');
      }

      var lasted = await GitLog.find({
        where: { team: team.id },
        sort: 'id DESC',
        limit: 1,
        skip: 0,
      });

      if (lasted.length > 0 && lasted[0].repositoryHash !== repositoryHash) {
        //リポジトリが異なっていたら洗い替え
        sails.log.info(`チーム[${team.id}]のgitリポジトリが変更されたためログをクリアし処理を続行します。`);
        await GitLog.destroy({
          where: { team: team.id },
        });
        lasted = [];
      }

      try {
        if (team.connectType === 0) {
          //github
          let resource = async function (team, page, perPage) {
            let url = new URL(`https://api.github.com/repos/${team.gitUser}/${team.gitRepository}/commits`);
            url.search = `page=${page}&per_page=${perPage}`;

            var headers = {
              Accept: 'application/vnd.github.v3+json',
            };
            if (team.gitPassword) {
              headers.Authorization = `token ${team.gitPassword}`;
            }

            try {
              var httpClient = axios.create();
              httpClient.defaults.timeout = 5000;
              var res = await httpClient.get(url.href, { headers: headers, data: {} });
              return res.data;
            } catch (err) {
              sails.log.error({
                message: `githubと接続ができませんでした [${url.href}] [${err}]`,
                team: team,
              });
              return [];
            }
          };

          try {
            let list = [];
            if (lasted.length > 0) {
              let data = await resource(team, 1, 1);
              if (data.length < 1) {
                sails.log.info(`チーム[${team.id}]のgitログは0件なので処理をスキップします！`);
                continue;
              }
              let headhash = data[0].sha;
              let localhash = lasted[0].hash;
              if (headhash === localhash) {
                //何もしない
                sails.log.info(`チーム[${team.id}]のgitログは最新なので処理をスキップします！`);
                continue;
              } else {
                //差分のログを取得
                let last = true;
                let page = 1;
                while (last) {
                  data = await resource(team, page, 50);
                  if (data.length < 1) {
                    break;
                  }
                  for (let log of data) {
                    if (log.id === localhash) {
                      last = false;
                      break;
                    }
                    list.push(log);
                  }
                  page++;
                }
              }
            } else {
              //全てのログを取得
              let page = 1;
              while (true) {
                let data = await resource(team, page, 50);
                if (data.length < 1) {
                  break;
                }
                for (let log of data) {
                  list.push(log);
                }
                page++;
              }
            }

            for (let log of list) {
              valueSets.push({
                // eslint-disable-next-line camelcase
                author_email: log.commit.author.email,
                // eslint-disable-next-line camelcase
                author_name: log.commit.author.name,
                commitAt: moment(log.commit.author.date).valueOf(),
                hash: log.sha,
                message: log.commit.message,
                refs: log.parents
                  .map((o) => {
                    return o.sha;
                  })
                  .join(', '),
                team: team.id,
                connectType: 0,
                repositoryHash: repositoryHash,
              });
            }
          } catch (err) {
            sails.log.error(`チーム[${team.id}]のgithubコミットログの取得に失敗しました` + err);
            continue;
          }
          //
        } else {
          //gitlab
          let resource = async function (team, page, perPage) {
            let url = new URL(`${team.gitlabApi}/projects/${team.gitlabProjectId}/repository/commits`);

            if (team.gitOrigin.toLowerCase() === 'master') {
              url.search = `private_token=${team.gitlabToken}&page=${page}&per_page=${perPage}`;
            } else {
              url.search = `private_token=${
                team.gitlabToken
              }&page=${page}&per_page=${perPage}&ref_name=${encodeURIComponent(team.gitOrigin)}`;
            }

            try {
              var httpClient = axios.create();
              httpClient.defaults.timeout = 5000;
              var res = await httpClient.get(url.href);
              return res.data;
            } catch (err) {
              sails.log.error({
                message: `gitlabと接続ができませんでした [${url.href}] [${err}]`,
                team: team,
              });
              return [];
            }
          };

          try {
            let list = [];
            if (lasted.length > 0) {
              let data = await resource(team, 1, 1);
              if (data.length < 1) {
                sails.log.info(`チーム[${team.id}]のgitログは0件なので処理をスキップします！`);
                continue;
              }
              let headhash = data[0].id;
              let localhash = lasted[0].hash;
              if (headhash === localhash) {
                //何もしない
                sails.log.info(`チーム[${team.id}]のgitログは最新なので処理をスキップします！`);
                continue;
              } else {
                //差分のログを取得
                let last = true;
                let page = 1;
                while (last) {
                  data = await resource(team, page, 50);
                  if (data.length < 1) {
                    break;
                  }
                  for (let log of data) {
                    if (log.id === localhash) {
                      last = false;
                      break;
                    }
                    list.push(log);
                  }
                  page++;
                }
              }
            } else {
              //全てのログを取得
              let page = 1;
              while (true) {
                let data = await resource(team, page, 50);
                if (data.length < 1) {
                  break;
                }
                for (let log of data) {
                  list.push(log);
                }
                page++;
              }
            }

            for (let log of list) {
              valueSets.push({
                // eslint-disable-next-line camelcase
                author_email: log.author_email,
                // eslint-disable-next-line camelcase
                author_name: log.author_name,
                body: log.title,
                commitAt: moment(log.authored_date).valueOf(),
                hash: log.id,
                message: log.message,
                refs: log.parent_ids.join(', '),
                team: team.id,
                connectType: 1,
                repositoryHash: repositoryHash,
              });
            }
          } catch (err) {
            sails.log.error(`チーム[${team.id}]のgitlabコミットログの取得に失敗しました` + err);
            continue;
          }
        }

        if (valueSets.length > 0) {
          await GitLog.createEach(valueSets.reverse());
          await sails.sendNativeQuery(NATIVE_SQL, [team.id, team.id]);
          sails.log.info(`チーム[${team.id}]のgitログを更新しました`);
        }
      } catch (err) {
        sails.log.error(`チーム[${team.id}]のgitログ収集に失敗しました。` + err);
      }
    }
  },
};
