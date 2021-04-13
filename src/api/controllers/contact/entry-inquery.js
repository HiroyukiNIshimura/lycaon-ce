module.exports = {
  friendlyName: 'request inquery',

  description: 'request inquery.',

  inputs: {
    contents: {
      type: 'string',
      maxLength: 2000,
      required: true,
    },
    categories: {
      type: 'ref',
    },
    fullName: {
      type: 'string',
      maxLength: 120,
      required: true,
    },
    emailAddress: {
      type: 'string',
      maxLength: 300,
      required: true,
      isEmail: true,
    },
    organization: {
      type: 'string',
      maxLength: 100,
    },
    zipCode: {
      type: 'string',
      maxLength: 50,
    },
    prefecture: {
      type: 'string',
      maxLength: 50,
    },
    city: {
      type: 'string',
      maxLength: 50,
    },
    street: {
      type: 'string',
      maxLength: 100,
    },
    building: {
      type: 'string',
      maxLength: 100,
    },
    phoneNo: {
      type: 'string',
      maxLength: 20,
    },
    honeypot: {
      type: 'string',
      maxLength: 10,
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
