module.exports = {
  friendlyName: 'getBot',
  description: 'get bot.',
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function () {
    try {
      var bot = await User.findOne({
        emailAddress: 'lycaonbot@example.com',
        fullName: 'lycaonbot',
        isNologin: true,
        isSandbox: true,
      }).populate('teams');

      return bot;
    } catch (err) {
      sails.log.debug(err);
      throw err;
    }
  },
};
