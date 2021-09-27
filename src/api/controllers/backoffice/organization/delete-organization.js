const fs = require('fs');
const path = require('path');
const utility = require('../../../../jobs/modules/job-utility');

module.exports = {
  friendlyName: 'delete organization',

  description: 'delete organization.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
  },
  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
    isBackOffice: {
      statusCode: 405,
      description: 'The provided this item is BackOffice.',
    },
  },

  fn: async function (inputs) {
    var current = await Organization.findOne({ id: inputs.id })
      .populate('users')
      .populate('teams')
      .populate('tags')
      .populate('categories');
    if (!current) {
      throw 'notFound';
    }
    if (current.isBackOffice) {
      throw 'isBackOffice';
    }

    var hostid = process.env.HOSTING_URL;
    if (!hostid) {
      hostid = 'localhost';
    }

    for (let user of current.users) {
      let target = path.resolve(sails.config.appPath, 'avatar', hostid, String(user.id));
      try {
        if (fs.existsSync(target)) {
          utility.rmdir(target);
          sails.log.debug(`アバターファイルを削除しました。${target}`);
        }
      } catch (err) {
        //無視
        sails.log.error(err);
      }
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Billing.destroy({ organization: current.id }).usingConnection(db);
        await User.destroy({ organization: current.id }).usingConnection(db);
        await Tag.destroy({ organization: current.id }).usingConnection(db);
        await Category.destroy({ organization: current.id }).usingConnection(db);
        await Message.destroy({ organization: current.id }).usingConnection(db);
        await Team.destroy({ organization: current.id }).usingConnection(db);

        await SysSettings.destroyOne({ organization: current.id }).usingConnection(db);
        await Organization.destroyOne({ id: current.id }).usingConnection(db);

        await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_thread_${current.handleId}";`).usingConnection(db);
        await sails.sendNativeQuery(`DROP SEQUENCE IF EXISTS "org_wiki_${current.handleId}";`).usingConnection(db);
      });

      sails.log.info(`組織 [ ${current.id} : ${current.handleId} ${current.name} ] を削除しました。`);

      this.req.session.effectMessage = sails.__('Removed the organization {0}').format(current.name);
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    return {};
  },
};
