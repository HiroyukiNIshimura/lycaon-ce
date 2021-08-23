module.exports = {
  friendlyName: 'genPin',
  description: 'generate pin.',
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function () {
    try {
      var S = '0123456789';
      var N = 6;
      return Array.from(Array(N))
        .map(() => S[Math.floor(Math.random() * S.length)])
        .join('');
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
