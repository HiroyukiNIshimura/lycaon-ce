const path = require('path');
const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const dicDir = './config/locales';

module.exports = {
  translate: async function (target) {
    const url = new URL(
      'https://script.google.com/macros/s/AKfycbzZ_NwOS5FWFVcRb4WeLkbIBMH1YY-_NbdDsFJFXbhbvR_JKCM/exec'
    );

    var targetJson = path.join(dicDir, target + '.json');

    var baseDic = JSON.parse(fs.readFileSync(path.join(dicDir, 'work.json'), 'utf8'));
    var destDic = {};

    try {
      for (let key of Object.keys(baseDic)) {
        url.search = `text=${baseDic[key]}&source=en&target=${target}`;
        var res = await axios.get(url.href);
        if (res.status == 200) {
          destDic[key] = res.data.text;
        } else {
          console.log(res);
          destDic[key] = '';
        }
      }

      if (!fs.existsSync(targetJson)) {
        destDic = _(destDic).toPairs().sortBy(0).fromPairs().value();
        fs.writeFileSync(path.join(dicDir, target + '.json'), JSON.stringify(destDic));
      } else {
        var targetDic = JSON.parse(fs.readFileSync(path.join(dicDir, target + '.json'), 'utf8'));
        for (let key of Object.keys(destDic)) {
          targetDic[key] = destDic[key];
        }
        targetDic = _(targetDic).toPairs().sortBy(0).fromPairs().value();
        fs.writeFileSync(path.join(dicDir, target + '.json'), JSON.stringify(targetDic));
      }
    } catch (err) {
      console.log(err);
    }

    //
  },
  sortByKeys: function (lang) {
    var targetJson = path.join(dicDir, lang + '.json');
    var baseDic = JSON.parse(fs.readFileSync(path.join(dicDir, 'work.json'), 'utf8'));

    if (!fs.existsSync(targetJson)) {
      baseDic = _(baseDic).toPairs().sortBy(0).fromPairs().value();
      fs.writeFileSync(path.join(dicDir, target + '.json'), JSON.stringify(baseDic));
    } else {
      var targetDic = JSON.parse(fs.readFileSync(path.join(dicDir, lang + '.json'), 'utf8'));
      for (let key of Object.keys(baseDic)) {
        targetDic[key] = baseDic[key];
      }
      targetDic = _(targetDic).toPairs().sortBy(0).fromPairs().value();
      fs.writeFileSync(path.join(dicDir, lang + '.json'), JSON.stringify(targetDic));
    }
  },
  deleteKey: function (lang, key) {
    var targetJson = path.join(dicDir, lang + '.json');
    var baseDic = JSON.parse(fs.readFileSync(path.join(dicDir, 'work-delete.json'), 'utf8'));
    if (fs.existsSync(targetJson)) {
      var targetDic = JSON.parse(fs.readFileSync(path.join(dicDir, lang + '.json'), 'utf8'));
      for (let key of Object.keys(baseDic)) {
        delete targetDic[key];
      }
      targetDic = _(targetDic).toPairs().sortBy(0).fromPairs().value();
      fs.writeFileSync(path.join(dicDir, lang + '.json'), JSON.stringify(targetDic));
    }
  },
};
