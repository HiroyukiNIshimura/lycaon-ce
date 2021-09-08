module.exports = {
  friendlyName: 'storage.findThreadActivities',
  description: 'find thread activities.',
  inputs: {
    id: {
      type: 'number',
      description: 'thread.id',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var response = {};

    response.sneezes = await Sneeze.find({
      where: {
        thread: inputs.id,
        deleted: false,
      },
      sort: 'id ASC',
    }).populate('owner');

    for (let entry of response.sneezes) {
      await User.setGravatarUrl(entry.owner);
    }

    response.replys = await Reply.find({
      where: {
        thread: inputs.id,
        deleted: false,
      },
      sort: 'id ASC',
    }).populate('owner');

    for (let entry of response.replys) {
      await User.setGravatarUrl(entry.owner);
    }

    response.activities = await ThreadActivity.find({
      where: {
        thread: inputs.id,
      },
      sort: 'id ASC',
    }).populate('user');

    for (let entry of response.activities) {
      if (entry.sneeze) {
        entry.sneeze = _.find(response.sneezes, {
          id: entry.sneeze,
        });
      }

      if (entry.reply) {
        entry.reply = _.find(response.replys, {
          id: entry.reply,
        });
      }
      await User.setGravatarUrl(entry.user, 36);
    }

    var i = 1;
    _.each(response.sneezes, (entry) => {
      entry.serialNumber = i;
      var children = _.where(response.replys, {
        sneeze: entry.id,
      });
      var j = 1;
      _.each(children, (reply) => {
        reply.serialNumber = j;
        reply.parentSerialNumber = i;
        j++;
      });
      i++;
    });

    return response;
  },
};
