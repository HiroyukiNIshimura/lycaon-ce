module.exports = {
  friendlyName: 'Get Billing list for Backoffice API',
  description: 'Get Billing list for Backoffice API.',

  exits: {
    success: {
      description: 'Authentication has been successfully.',
    },
  },

  fn: async function () {
    var list = await Billing.find({
      sort: 'id ASC',
    }).populate('organization');

    list = _.filter(list, (o) => {
      return !o.organization.isBackOffice;
    });

    return list;
  },
};
