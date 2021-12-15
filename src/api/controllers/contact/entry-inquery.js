module.exports = {
  friendlyName: 'request inquery',

  description: 'request inquery.',

  inputs: {
    contents: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 2000;
      },
      required: true,
    },
    categories: {
      type: 'json',
    },
    fullName: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 120;
      },
      required: true,
    },
    emailAddress: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 300;
      },
      required: true,
      isEmail: true,
    },
    organization: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    zipCode: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 50;
      },
    },
    prefecture: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 50;
      },
    },
    city: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 50;
      },
    },
    street: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    building: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    phoneNo: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 20;
      },
    },
    honeypot: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 10;
      },
    },
  },

  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (inputs.honeypot) {
      throw 'notFound';
    }
    this.req.session.inquery = inputs;
    return {};
  },
};
