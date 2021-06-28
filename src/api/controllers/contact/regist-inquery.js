module.exports = {
  friendlyName: 'regist inquery',

  description: 'regist inquery.',

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
    captchaToken: {
      type: 'string',
      maxLength: 5,
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

    if (!this.req.session.inquery) {
      throw 'notFound';
    }

    if (!this.req.session.captchaToken) {
      return { invalidToken: true };
    }

    if (this.req.session.captchaToken !== inputs.captchaToken) {
      return { invalidToken: true };
    }
    delete this.req.session.captchaToken;

    var backoffice = await Organization.findOne({ handleId: 'brightl' });

    var inquery = _.extend({}, inputs);

    var categories = [
      'Questions about application',
      'Questions about features',
      'On-premises quote',
      'Inquiries about disabilities',
      'Questions about cancellation',
      'Other',
    ];

    // バックオフィスあて
    sails.hooks.i18n.setLocale('ja');
    var buffja = [];
    if (inputs.categories && inputs.categories.length > 0) {
      _.each(inputs.categories, (val) => {
        buffja.push(sails.__(categories[val]));
      });
    }

    inquery.category = buffja.join(', ');

    await sails.helpers.sendTemplateEmail.with({
      organization: backoffice,
      to: sails.config.custom.backofficeMailAddress,
      subject: '問い合わせフォームからの入力通知',
      template: 'email-bo-inquery',
      templateData: {
        inquery: inquery,
        locale: 'ja',
      },
    });

    sails.hooks.i18n.setLocale(this.req.getLocale());
    var buff = [];
    if (inputs.categories && inputs.categories.length > 0) {
      _.each(inputs.categories, (val) => {
        buff.push(sails.__(categories[val]));
      });
    }

    inquery.category = buff.join(', ');

    await sails.helpers.sendTemplateEmail.with({
      organization: backoffice,
      to: inquery.emailAddress,
      subject: sails.__('Thank you for your inquiry'),
      template: 'email-confirm-inquery',
      templateData: {
        inquery: inquery,
        locale: this.req.getLocale(),
      },
    });

    return {};
  },
};
