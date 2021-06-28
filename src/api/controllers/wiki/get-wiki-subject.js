module.exports = {
  friendlyName: 'get wiki subject',
  description: 'get wiki subject.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      description: `Wiki's status successfully updated.`,
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a wiki that has not joined.',
    },
  },

  fn: async function (inputs) {
    try {
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

      return { subject: current.subject, concept: current.concept };
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
