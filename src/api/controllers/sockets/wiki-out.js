module.exports = {
  friendlyName: 'wiki edit out',
  description: 'wiki edit out.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var wiki = await Wiki.findOne({
      id: inputs.id,
    });
    if (!wiki) {
      throw 'notFound';
    }

    if (wiki.concept === 0) {
      if (!this.req.organization) {
        return 'notFound';
      }

      var team = await sails.helpers.validateMembership.with({
        id: wiki.team,
        user: this.req.me,
      });
      if (!team) {
        throw 'notFound';
      }
      if (team.organization !== this.req.organization.id) {
        throw 'notFound';
      }
      //Wikiは編集中の通知だけなのでWiki.IDまで指定したRoom名
      var room = `room-${this.req.organization.id}-wiki-${wiki.id}`;
      sails.sockets.leave(this.req, room);
    }

    return {};
  },
};
