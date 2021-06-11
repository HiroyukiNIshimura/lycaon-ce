const dclassify = require('dclassify');
const kuromojin = require('kuromojin');
const _ = require('lodash');
const sanitizeHtml = require('sanitize-html');

module.exports = {
  friendlyName: 'Emotion Check',
  description: 'Emotion Check utility.',
  inputs: {
    contents: {
      type: 'string',
      description: 'markdown text',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var response = {
      anger: {
        score: 0,
        turn: 0,
      },
      fear: {
        score: 0,
        turn: 0,
      },
      happy: {
        score: 0,
        turn: 0,
      },
      hatred: {
        score: 0,
        turn: 0,
      },
      sad: {
        score: 0,
        turn: 0,
      },
      shame: {
        score: 0,
        turn: 0,
      },
      surprise: {
        score: 0,
        turn: 0,
      },
    };

    if (!inputs.contents || !sails.config.custom.classifier) {
      return response;
    }

    var regex = new RegExp('[-#`|]', 'g');

    var content = sanitizeHtml(await sails.helpers.mdToHtml.with({ markdown: inputs.contents }), {
      allowedTags: [],
      allowedAttributes: {},
      exclusiveFilter: function (frame) {
        return !frame.text.trim();
      },
      textFilter: function (text, tagName) {
        if (['a', 'pre', 'code'].indexOf(tagName) > -1) {
          return '';
        }
        return text.trim().replace(regex, '') + '。';
      },
    });

    //重要な処理ではないので、メモリ使いすぎないように
    if (content.length > 2000) {
      content = content.substring(1, 2000);
    }

    var Document = dclassify.Document;
    var tokens = await kuromojin.tokenize(content);
    var scores = [];
    var buffer = [];

    for (let o of tokens) {
      if (o.pos === '記号' && (o.pos_detail_1 === '句点' || o.pos_detail_1 === '空白')) {
        if (buffer.length > 0) {
          var sample = new Document('sample', buffer);
          var result = sails.config.custom.classifier.classify(sample);
          if (!isNaN(result.probability)) {
            scores.push({
              category: result.category,
              probability: result.probability,
              tokens: buffer.join(''),
            });
          }
          buffer = [];
        }
        continue;
      }
      buffer.push(o.surface_form);
    }

    if (scores.length < 1) {
      return response;
    }

    var statistics = [];
    for (let score of scores) {
      let exists = _.find(statistics, (o) => {
        return o.category === score.category;
      });
      if (exists) {
        exists.probability += score.probability;
        exists.tokens += '。' + score.tokens;
        exists.turn++;
      } else {
        statistics.push(_.extend({ turn: 1 }, score));
      }
    }
    statistics = _.orderBy(statistics, ['probability', 'turn'], ['desc', 'desc']);

    for (let entry of statistics) {
      response[entry.category].score = entry.probability;
      response[entry.category].turn = entry.turn;
    }

    return response;
  },
};
