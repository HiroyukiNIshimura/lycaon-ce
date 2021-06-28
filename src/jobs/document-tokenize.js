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
    if (item.mimeType === 'application/pdf') {
      token = await this.fromPdf(item);
    } else if (item.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      token = this.fromExcel(item);
    } else if (item.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      token = await this.fromWord(item);
    } else if (item.mimeType === 'text/plain') {
      var buffer = fs.readFileSync(path.resolve(sails.config.appPath, item.virtualPath));
      var detected = encoding.detect(buffer);
      token = encoding.convert(buffer, {
        from: detected,
        to: 'UNICODE',
        type: 'string',
      });
    } else {
      return;
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
