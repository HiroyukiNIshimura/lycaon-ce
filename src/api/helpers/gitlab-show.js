const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

const MAX_DIFF_DATA_SIZE = 2000;

module.exports = {
  friendlyName: 'parse gitlab show response',
  description: 'parse gitlab show response.',
  inputs: {
    gitlog: {
      type: 'ref',
      required: true,
    },
    row: {
      type: 'number',
      isInteger: true,
      min: 0,
    },
    me: {
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
    var response = {
      id: gitlog.id,
      cloudError: '',
      team: gitlog.team,
      response: '',
      header: {
        commit: '',
        author: {
          name: '',
          email: '',
        },
        date: '',
        message: '',
      },
      diffs: [],
    };

    moment.locale(inputs.me.languagePreference);

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
      if (!isNaN(inputs.row) && diffs.length > inputs.row) {
        var file = diffs[inputs.row];
        response.diffs.push({
          line1: `diff --git a/${file.old_path} b/${file.new_path}`,
          line2: `index ${file.a_mode} ${file.b_mode}`,
          body: file.diff,
          sizeorver: false,
          blob: false,
          row: inputs.row,
        });
        return response;
      }

      var row = 0;
      for (let file of diffs) {
        var diff = {
          line1: `diff --git a/${file.old_path} b/${file.new_path}`,
          line2: `index ${file.a_mode} ${file.b_mode}`,
          body: '',
          sizeorver: false,
          row: row,
        };

        if (!file.diff || !file.diff.trim()) {
          diff.blob = true;
        } else if (file.diff.length <= MAX_DIFF_DATA_SIZE) {
          diff.body = file.diff;
        } else {
          diff.sizeorver = true;
        }

        response.diffs.push(diff);
        row++;
      }
      //
      var commit = await getCommit(gitlog.team, gitlog.hash);
      response.header.commit = commit.id;
      response.header.author.name = commit.author_name;
      response.header.author.email = commit.author_email;
      response.header.date = moment(commit.authored_date).format();
      response.header.message = commit.message;
      //
    } catch (err) {
      sails.log.error(err);
      response.cloudError = 'repositoryNotfound';
      return response;
    }

    return response;
  },
};
