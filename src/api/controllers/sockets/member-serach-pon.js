module.exports = {
  friendlyName: 'Member serach pon',

  description: '',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    manSercher: {
      type: 'number',
      required: true,
    },
    threadId: {
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

    var manSercher = await User.findOne({ id: inputs.manSercher });
    var manSercherTeam = await sails.helpers.validateMembership.with({
      id: inputs.id,
      user: manSercher,
    });
    if (!manSercherTeam) {
      throw 'notFound';
    }
    if (manSercherTeam.organization !== this.req.organization.id) {
      throw 'notFound';
    }

    var thread = await Thread.findOne({
      id: inputs.threadId,
    });
    if (!thread) {
      throw 'notFound';
    }

    if (thread.team !== inputs.id) {
      throw 'notFound';
    }

    var message = sails.__('The member you are looking for {0} is here now!').format(team.users[0].fullName);
    var url = `/${this.req.organization.handleId}/thread/${thread.no}`;

    var room = `room-${this.req.organization.id}-lycaon`;
    sails.sockets.broadcast(room, 'serach-member-pon', {
      message: message,
      url: url,
      serachMember: this.req.me,
      manSercher: inputs.manSercher,
    });

    return {};
  },
};
