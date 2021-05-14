const path = require('path');
const fs = require('fs');
const xslx = require('xlsx-extract').XLSX;
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const kuromojin = require('kuromojin');
const encoding = require('encoding-japanese');

module.exports = {
  tokenize: async function (type, item) {
    var token = '';
    if (item.mimeType === 'application/pdf') {
      token = await this.fromPdf(item);
    } else if (
      item.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      token = await this.fromExcel(item);
    } else if (
      item.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
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
      var file = path.resolve(sails.config.appPath, item.virtualPath);

      return new Promise(function (resolve, reject) {
        var tokens = [];
        new xslx()
          .extract(file, { sheet_all: true })
          .on('cell', function (cell) {
            if (cell) {
              if (!tokens.find((el) => el == cell)) {
                tokens.push(cell);
              }
            }
          })
          .on('error', function (err) {
            sails.log.error(err);
            reject(err);
          })
          .on('end', function (err) {
            resolve(tokens.join('.'));
          });
      });
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

      return new Promise(function (resolve, reject) {
        pdf(dataBuffer)
          .then(function (data) {
            resolve(data.text);
          })
          .catch(function (err) {
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
    var words = await kuromojin.tokenize(tokens);
    for (let word of words) {
      if (
        word.pos === '名詞' ||
        word.pos === '動詞' ||
        word.pos === '形容詞' ||
        word.pos === '形容動詞'
      ) {
        if (
          word.pos_detail_1 !== '接尾' &&
          word.pos_detail_1 !== '数' &&
          word.surface_form.length <= 30
        ) {
          var form = word.surface_form;
          if (word.basic_form !== '*') {
            form = word.basic_form;
          }

          if (!buffer.find((el) => el == form)) {
            buffer.push(form);
          }
        }
      }
    }
    return buffer.join(' ');
  },
};
