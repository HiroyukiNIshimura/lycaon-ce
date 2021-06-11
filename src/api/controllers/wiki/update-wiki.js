module.exports = {
  friendlyName: 'Update wiki',

  description: 'Update "Wiki" page.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    subject: {
      type: 'string',
      maxLength: 200,
      required: true,
    },
    body: {
      type: 'string',
      custom: function (value) {
        if (!value) {
          return true;
        }
        return Buffer.byteLength(value, 'utf8') < 107374180;
      },
      example: 'これはMarkdownのままのデータ',
    },
    concept: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
    },
    tags: {
      type: 'ref',
    },
    deleted: {
      type: 'boolean',
      description: '論理削除フラグ',
    },
  },

  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    unauthorized: {
      statusCode: 405,
      description: 'The provided name is already in use.',
    },
  },

  fn: async function (inputs) {
    if (!this.req.me.isSuperAdmin && inputs.concept === 1) {
      throw 'unauthorized';
    }

    var current = await Wiki.findOne({
      id: inputs.id,
    });
    if (!current) {
      throw 'notFound';
    }

    if (current.concept === 0) {
      var team = await sails.helpers.validateMembership.with({
        id: current.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }
    }

    var wiki = _.clone(inputs);
    wiki.tags = [];
    wiki.lastUpdateUser = this.req.me.id;

    var updated = {};

    try {
      await sails.getDatastore().transaction(async (db) => {
        for (let entry of inputs.tags) {
          var tags = await Tag.find()
            .where({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
            .usingConnection(db);

          if (tags.length < 1) {
            tag = await Tag.create({
              name: entry.value.toLowerCase(),
              organization: this.req.me.organization.id,
            })
              .fetch()
              .usingConnection(db);
            wiki.tags.push(tag.id);
          } else {
            wiki.tags.push(tags[0].id);
          }
        }

        wiki.tagToken = '';
        _.each(wiki.tags, (tag) => {
          wiki.tagToken += tag + ':';
        });

        updated = await Wiki.updateOne({
          id: wiki.id,
        })
          .set(wiki)
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var message = {
      key: '{0} has updated the subject or body of the Wiki [#{1}] {2}',
      params: [this.req.me.fullName, updated.id, updated.subject],
    };
    //
    sails.sockets.broadcast(`room-${this.req.organization.id}-wiki-${updated.id}`, 'wiki-update', {
      message: message,
      user: this.req.me,
      wiki: updated,
    });

    this.req.session.effectMessage = sails.__('The Wiki has been updated');

    return {};
  },
};
