const moment = require('moment');
const axios = require('axios');

const MAX_DIFF_DATA_SIZE = 2000;

module.exports = {
  friendlyName: 'parse github show response',
  description: 'parse github show response.',
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

      if (!isNaN(inputs.row) && commit.files.length > inputs.row) {
        var file = commit.files[inputs.row];

        response.diffs.push({
          line1: file.filename,
          line2: file.sha,
          body: file.patch,
          sizeorver: false,
          blob: false,
          row: inputs.row,
        });
        return response;
      }

      response.header.commit = commit.sha;
      response.header.author.name = commit.commit.author.name;
      response.header.author.email = commit.commit.author.email;
      response.header.date = moment(commit.commit.author.date).format();
      response.header.message = commit.commit.message;

      var row = 0;
      for (let file of commit.files) {
        var diff = {
          line1: file.filename,
          line2: file.sha,
          body: '',
          sizeorver: false,
          row: row,
        };

        if (!file.patch || !file.patch.trim()) {
          diff.blob = true;
        } else if (file.patch.length <= MAX_DIFF_DATA_SIZE) {
          diff.body = file.patch;
        } else {
          diff.sizeorver = true;
        }

        response.diffs.push(diff);
        row++;
      }
      //
    } catch (err) {
      sails.log.error(err);
      response.cloudError = 'repositoryNotfound';
      return response;
    }

    return response;
  },
};
