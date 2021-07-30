const path = require('path');
const fs = require('fs');

module.exports = {
  friendlyName: 'Update profile',

  description: 'Update the profile for the logged-in user.',

  inputs: {
    fullName: {
      type: 'string',
      required: true,
    },
    emailAddress: {
      type: 'string',
      required: true,
    },
    skil: {
      type: 'string',
    },
    avatarType: {
      type: 'string',
      isIn: ['identify', 'user-avatar', 'gravatar'],
      defaultsTo: 'identify',
    },
    selectedTeams: {
      type: 'ref',
    },
    selectedCategories: {
      type: 'ref',
    },
    selectedTags: {
      type: 'ref',
    },
    notNeedMyOwnEmail: {
      type: 'boolean',
    },
    noRaiseThreadNotify: {
      type: 'boolean',
    },
    noRaiseInoutNotify: {
      type: 'boolean',
    },
    language: {
      type: 'string',
      required: true,
      maxLength: 5,
    },
  },

  exits: {
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    if (this.req.me.isNologin) {
      throw 'notFound';
    }

    var newEmailAddress = inputs.emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // Determine if this request wants to change the current user's email address,
    // revert her pending email address change, modify her pending email address
    // change, or if the email address won't be affected at all.
    var desiredEmailEffect; // ('change-immediately', 'begin-change', 'cancel-pending-change', 'modify-pending-change', or '')
    if (
      newEmailAddress === undefined ||
      (this.req.me.emailStatus !== 'change-requested' && newEmailAddress === this.req.me.emailAddress) ||
      (this.req.me.emailStatus === 'change-requested' && newEmailAddress === this.req.me.emailChangeCandidate)
    ) {
      desiredEmailEffect = '';
    } else if (this.req.me.emailStatus === 'change-requested' && newEmailAddress === this.req.me.emailAddress) {
      desiredEmailEffect = 'cancel-pending-change';
    } else if (this.req.me.emailStatus === 'change-requested' && newEmailAddress !== this.req.me.emailAddress) {
      desiredEmailEffect = 'modify-pending-change';
    } else if (!sails.config.custom.verifyEmailAddresses || this.req.me.emailStatus === 'unconfirmed') {
      desiredEmailEffect = 'change-immediately';
    } else {
      desiredEmailEffect = 'begin-change';
    }

    // If the email address is changing, make sure it is not already being used.
    if (_.contains(['begin-change', 'change-immediately', 'modify-pending-change'], desiredEmailEffect)) {
      let conflictingUser = await User.findOne({
        or: [
          {
            emailAddress: newEmailAddress,
          },
          {
            emailChangeCandidate: newEmailAddress,
          },
        ],
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }

    // Start building the values to set in the db.
    // (We always set the fullName if provided.)
    var valuesToSet = {
      fullName: inputs.fullName,
      skil: inputs.skil,
      avatarType: inputs.avatarType,
      emailNoThankYous: inputs.selectedTeams.map((o) => o.id),
      sendMailCategories: inputs.selectedCategories.map((o) => o.id),
      sendMailTags: inputs.selectedTags.map((o) => o.id),
      notNeedMyOwnEmail: inputs.notNeedMyOwnEmail,
      noRaiseThreadNotify: inputs.noRaiseThreadNotify,
      noRaiseInoutNotify: inputs.noRaiseInoutNotify,
      languagePreference: inputs.language,
    };

    if (inputs.avatarType !== 'user-avatar') {
      if (this.req.me.avatarVirtualPath) {
        var file = path.resolve(sails.config.appPath, this.req.me.avatarVirtualPath);
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
      valuesToSet.avatarVirtualPath = '';
      valuesToSet.avatarVirtualUrl = '';
    }

    switch (desiredEmailEffect) {
      // Change now
      case 'change-immediately':
        _.extend(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: this.req.me.emailStatus === 'unconfirmed' ? 'unconfirmed' : 'confirmed',
        });
        break;

      // Begin new email change, or modify a pending email change
      case 'begin-change':
      case 'modify-pending-change':
        _.extend(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random('url-friendly'),
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: 'change-requested',
        });
        break;

      // Cancel pending email change
      case 'cancel-pending-change':
        _.extend(valuesToSet, {
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: 'confirmed',
        });
        break;

      // Otherwise, do nothing re: email
    }

    // Save to the db
    await User.updateOne({
      id: this.req.me.id,
    }).set(valuesToSet);

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (desiredEmailEffect === 'begin-change' || desiredEmailEffect === 'modify-pending-change') {
      await sails.helpers.sendTemplateEmail.with({
        organization: this.req.organization,
        to: newEmailAddress,
        subject: sails.__('Notification of completion of email address change'),
        template: 'email-verify-new-email',
        templateData: {
          fullName: inputs.fullName || this.req.me.fullName,
          token: valuesToSet.emailProofToken,
          locale: this.req.me.languagePreference,
        },
      });
    }
  },
};
