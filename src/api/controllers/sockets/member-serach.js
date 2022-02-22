module.exports = {
  friendlyName: 'Member serach',

  description: '',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    serachMember: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a team that has not joined.',
    },
  },

  fn: async function (inputs) {
    var team = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }
    if (team.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var room = `room-${this.req.organization.id}-lycaon`;

    var serachMember = await User.findOne({ id: inputs.serachMember });
    var bot = await sails.helpers.getBot();

    if (serachMember.id === bot.id) {
      var message = sails.__('Unfortunately, I only work in the virtual world');
      var url = '#';

      sails.sockets.broadcast(room, 'serach-member-pon', {
        message: message,
        url: url,
        serachMember: inputs.serachMember,
        manSercher: this.req.me.id,
      });
      return {};
    }

    var memberTeam = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: serachMember,
    });
    if (!memberTeam) {
      throw 'notFound';
    }
    if (memberTeam.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    sails.sockets.broadcast(room, 'serach-member', {
      manSercher: this.req.me.id,
      serachMember: inputs.serachMember,
    });

    return {};
  },
};
