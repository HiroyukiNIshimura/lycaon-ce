module.exports = {
  friendlyName: 'join organization',
  description: 'join organization.',
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
  },

  fn: async function () {
    if (!this.req.isSocket) {
      return 'notFound';
    }

    if (!this.req.organization) {
      return 'notFound';
    }

    sails.sockets.join(this.req, `room-${this.req.organization.id}-lycaon`);

    return {};
  },
};
