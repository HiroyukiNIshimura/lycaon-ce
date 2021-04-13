const moment = require('moment');

module.exports = {
  friendlyName: 'request change',

  description: 'request change.',

  inputs: {
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
    requestAlready: {
      statusCode: 409,
      description: 'already in process.',
    },
    samePlan: {
      statusCode: 409,
      description: 'already in use.',
    },
  },

  fn: async function (inputs) {
    var current = await Billing.findOne({ organization: this.req.organization.id }).populate(
      'organization'
    );
    if (!current) {
      throw 'notFound';
    }
    if (current.planChangeAt) {
      throw 'requestAlready';
    }

    if (current.organization.plan === inputs.plan) {
      throw 'samePlan';
    }

    var response = {};

    var plans = Object.keys(sails.config.custom.plans);
    var before = _.findIndex(plans, function (entry) {
      return entry === current.organization.plan;
    });
    var after = _.findIndex(plans, function (entry) {
      return entry === inputs.plan;
    });

    if (before < after) {
      response.grade = 'upgrade';
    } else {
      response.grade = 'downgrade';
    }

    response.after = inputs.plan;

    return response;
  },
};
