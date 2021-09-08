module.exports = {
  friendlyName: 'View account overview',

  description: 'Display "Account Overview" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/account/account-overview',
    },
  },

  fn: async function () {
    var messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    var emailAddressNoLongerAvailable = false;
    if (this.req.session.emailAddressNoLongerAvailable) {
      emailAddressNoLongerAvailable = true;
      delete this.req.session.emailAddressNoLongerAvailable;
    }

    // If billing features are enabled, include our configured Stripe.js
    // public key in the view locals.  Otherwise, leave it as undefined.
    return {
      messageStack: messageStack,
      stripePublishableKey: sails.config.custom.enableBillingFeatures
        ? sails.config.custom.stripePublishableKey
        : undefined,
      emailAddressNoLongerAvailable: emailAddressNoLongerAvailable,
    };
  },
};
