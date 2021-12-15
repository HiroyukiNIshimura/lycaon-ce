const dbdumper = require('./db-dump');
const path = require('path');

module.exports = {
  migration: async function () {
    sails.log.info('自動マイグレーションを実行します...');
    var zip = await dbdumper.backup();

    function tableUpdate(adapter, datastoreName, tableName, tableDDLSpec) {
      return new Promise((resolve, reject) => {
        adapter.drop(datastoreName, tableName, undefined, function dropCallback(err) {
          if (err) {
            reject(err);
          }

          adapter.define(datastoreName, tableName, tableDDLSpec, function defineCallback(err) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      });
    }

    //テーブル更新
    var datastoer = sails.getDatastore();
    var datastoreName = datastoer.config.adapter;
    var WLAdapter = sails.adapters[datastoreName];
    var hasError = false;

    if (WLAdapter) {
      for (let identity in sails.models) {
        var WLModel = sails.models[identity];
        var tableDDLSpec = {};

        try {
          _.each(WLModel.schema, function parseAttribute(wlsAttrDef, wlsAttrName) {
            if (wlsAttrDef.collection) {
              return;
            }

            var columnName = wlsAttrDef.columnName;

            if (!_.has(wlsAttrDef, 'autoMigrations')) {
              throw new Error(
                'An attribute in the model definition: `' +
                  wlsAttrName +
                  // eslint-disable-next-line quotes
                  "` is missing an `autoMigrations` property. When running the `alter` migration, each attribute must have an autoMigrations key so that you don't end up with an invalid data schema."
              );
            }

            tableDDLSpec[columnName] = wlsAttrDef.autoMigrations;
            if (wlsAttrDef.foreignKey) {
              //tableDDLSpec[columnName].columnType = '_numbertimestamp';
            }
          });
        } catch (err) {
          sails.log.error(err);
          return;
        }

        var primaryKeyAttrName = WLModel.primaryKey;
        var primaryKey = WLModel.schema[primaryKeyAttrName];
        if (primaryKey) {
          var pkColumnName = primaryKey.columnName;
          tableDDLSpec[pkColumnName].primaryKey = true;
          //tableDDLSpec[pkColumnName].columnType = '_numbertimestamp';
        }

        try {
          await tableUpdate(WLAdapter, WLModel.datastore, WLModel.tableName, tableDDLSpec);
          sails.log.info(`${WLModel.tableName}...スキーマアップデート完了`);
        } catch (err) {
          sails.log.error(err);
          hasError = true;
          break;
        }
      }
    }

    await dbdumper.recovery(path.basename(zip));

    if (hasError) {
      sails.log.error('自動マイグレーションに失敗しました。');
    } else {
      sails.log.info('自動マイグレーションが完了しました。');
    }
  },
};
