const moment = require('moment');

module.exports = {
  friendlyName: 'Update wiki vote',
  description: 'Update the wiki vote.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    vote: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: "Wiki's status successfully updated.",
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a wiki that has not joined.',
    },
    voteAlreadyInUse: {
      statusCode: 409,
      description: 'The provided vote is already in use.',
    },
    voteStillInUse: {
      statusCode: 405,
      description: 'The provided vote is still in use.',
    },
  },

  fn: async function (inputs) {
    var current = await Wiki.findOne({
      id: inputs.id,
    }).populate('votes');
    if (!current) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: current.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    var voted = _.findIndex(current.votes, { id: this.req.me.id }) > -1;
    var setValue = current.votes.map((o) => {
      return o.id;
    });

    if (!current.nice) {
      current.nice = 0;
    }

    if (voted) {
      if (inputs.vote === 1) {
        throw 'voteAlreadyInUse';
      } else {
        _.pull(setValue, this.req.me.id);
        current.nice--;
      }
    } else {
      if (inputs.vote === -1) {
        throw 'voteStillInUse';
      } else {
        setValue.push(this.req.me.id);
        current.nice++;
      }
    }

    try {
      await sails.getDatastore().transaction(async (db) => {
        await Wiki.updateOne({
          id: current.id,
        })
          .set({ votes: setValue, nice: current.nice })
          .usingConnection(db);
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('Updated likes');

    return {};
  },
};
