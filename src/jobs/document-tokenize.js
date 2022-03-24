const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const kuromojin = require('kuromojin');
const encoding = require('encoding-japanese');
const _ = require('@sailshq/lodash');

module.exports = {
  tokenize: async function (type, item) {
    var token = '';
    try {
      switch (item.mimeType) {
        case 'application/pdf':
          token = await this.fromPdf(item);
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          token = this.fromExcel(item);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          token = await this.fromWord(item);
          break;
        case 'text/plain':
        case 'text/csv':
        case 'text/html':
        case 'text/javascript':
        case 'text/xml':
        case 'application/json':
        case 'application/xml':
          var buffer = fs.readFileSync(path.resolve(sails.config.appPath, item.virtualPath));
          var detected = encoding.detect(buffer);
          token = encoding.convert(buffer, {
            from: detected,
            to: 'UNICODE',
            type: 'string',
          });
          break;

        default:
          return;
      }
    } catch (error) {
      //添付してすぐ削除されるとファイルが無くなっているのでそういうのは無視
    }

    if (!token) {
      return;
    }

    var qWords = await this.wakati(token);

    await sails.getDatastore().transaction(async (db) => {
      if (type === 'thread') {
        await ThreadItem.updateOne({ id: item.id }).set({ qWords: qWords }).usingConnection(db);
      } else if (type === 'wiki') {
        await WikiItem.updateOne({ id: item.id }).set({ qWords: qWords }).usingConnection(db);
      } else if (type === 'vote') {
        await VoteItem.updateOne({ id: item.id }).set({ qWords: qWords }).usingConnection(db);
      } else {
        //
      }
    });
  },
  fromExcel: function (item) {
    try {
      var tokens = '';

      var file = path.resolve(sails.config.appPath, item.virtualPath);
      var book = xlsx.readFile(file);
      for (let sheetName of book.SheetNames) {
        var sheet = book.Sheets[sheetName];
        var json = xlsx.utils.sheet_to_json(sheet);
        for (let obj of json) {
          var vals = _.values(obj);
          tokens += vals.join('.');
          if (tokens.length > 5000) {
            break;
          }
        }
        if (tokens.length > 5000) {
          break;
        }
      }

      return tokens;
    } catch (err) {
      sails.log.error(err);
      return '';
    }
  },
  fromWord: async function (item) {
    try {
      var file = path.resolve(sails.config.appPath, item.virtualPath);
      var result = await mammoth.extractRawText({
        path: file,
      });
      return result.value;
    } catch (err) {
      sails.log.error(err);
      return '';
    }
  },
  fromPdf: function (item) {
    try {
      var file = path.resolve(sails.config.appPath, item.virtualPath);
      var dataBuffer = fs.readFileSync(file);

      return new Promise((resolve, reject) => {
        pdf(dataBuffer)
          .then((data) => {
            resolve(data.text);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } catch (err) {
      sails.log.error(err);
      return '';
    }
  },
  wakati: async function (tokens) {
    var buffer = [];
    tokens = tokens.replace(/[!-/:-@[-`{-~]/g, ' ');
    if (tokens.length > 5000) {
      tokens = tokens.substr(0, 5000);
    }

    var words = await kuromojin.tokenize(tokens);
    for (let word of words) {
      if (word.pos === '名詞' || word.pos === '動詞' || word.pos === '形容詞' || word.pos === '形容動詞') {
        if (word.pos_detail_1 !== '接尾' && word.pos_detail_1 !== '数' && word.surface_form.length <= 30) {
          var form = word.surface_form;
          if (word.basic_form !== '*') {
            form = word.basic_form;
          }

          if (!buffer.find((el) => el === form)) {
            buffer.push(form);
          }
        }
      }
    }
    return buffer.join(' ');
  },
};
