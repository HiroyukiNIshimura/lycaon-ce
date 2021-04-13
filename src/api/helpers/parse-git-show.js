const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

module.exports = {
  friendlyName: 'parse git show response',
  description: 'parse git show response.',
  inputs: {
    gitlog: {
      type: 'ref',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var gitlog = inputs.gitlog;
    var response = { cloudError: '', team: gitlog.team, response: '' };

    var exeistDir = function (workdir) {
      try {
        fs.statSync(workdir);
        return true;
      } catch (error) {
        if (error.code === 'ENOENT') {
          return false;
        } else {
          sails.log.error(err);
          throw err;
        }
      }
    };

    if (gitlog.team.connectType === 0) {
      var getCommit = async function (team, hash) {
        let url = new URL(
          `https://api.github.com/repos/${team.gitUser}/${team.gitRepository}/commits/${hash}`
        );

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
          throw new Error(
            sails.__('Could not connect with github [{0}] [{1}]').format(url.href, err)
          );
        }
      };

      try {
        var commit = await getCommit(gitlog.team, gitlog.hash);

        var body = '';

        body += `commit ${commit.sha}\n`;
        body += `Author: ${commit.commit.author.name} <${commit.commit.author.email}>\n`;
        body += `Date:   ${moment(commit.commit.author.date).format()}\n`;
        body += `\n    ${commit.commit.message}\n`;

        for (let file of commit.files) {
          body += `\n ${file.filename}\n`;
          body += `${file.sha}\n`;
          body += file.patch;
          body += `\n`;
        }

        response.response = body;
        //
      } catch (err) {
        response.cloudError = 'repositoryNotfound';
        return response;
      }
    } else {
      var getDiffs = async function (team, hash) {
        let url = new URL(
          `${team.gitlabApi}/projects/${team.gitlabProjectId}/repository/commits/${hash}/diff`
        );
        url.search = `private_token=${team.gitlabToken}`;
        try {
          var res = await axios.get(url.href);
          return res.data;
        } catch (err) {
          sails.log.error({
            message: `gitlabと接続ができませんでした [${url.href}] [${err}]`,
            team: team,
          });
          throw new Error(
            sails.__('Could not connect with gitlab [{0}] [{1}]').format(url.href, err)
          );
        }
      };

      var getCommit = async function (team, hash) {
        let url = new URL(
          `${team.gitlabApi}/projects/${team.gitlabProjectId}/repository/commits/${hash}`
        );
        url.search = `private_token=${team.gitlabToken}`;
        try {
          var res = await axios.get(url.href);
          return res.data;
        } catch (err) {
          sails.log.error({
            message: `gitlabと接続ができませんでした [${url.href}] [${err}]`,
            team: team,
          });
          throw new Error(
            sails.__('Could not connect with gitlab [{0}] [{1}]').format(url.href, err)
          );
        }
      };

      try {
        var diffs = await getDiffs(gitlog.team, gitlog.hash);
        var commit = await getCommit(gitlog.team, gitlog.hash);

        var body = '';

        body += `commit ${commit.id}\n`;
        body += `Author: ${commit.author_name} <${commit.author_email}>\n`;
        body += `Date:   ${moment(commit.authored_date).format()}\n`;
        body += `\n    ${commit.message}\n`;

        for (let diff of diffs) {
          body += `\ndiff --git a/${diff.old_path} b/${diff.new_path}\n`;
          body += `index ${diff.a_mode} ${diff.b_mode}\n`;
          body += diff.diff;
          body += `\n`;
        }

        response.response = body;
      } catch (err) {
        response.cloudError = 'repositoryNotfound';
        return response;
      }
    }

    return response;
  },
};
