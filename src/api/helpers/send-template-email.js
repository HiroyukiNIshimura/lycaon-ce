const nodemailer = require('nodemailer');

module.exports = {
  friendlyName: 'Send template email',

  description: 'Send an email using a template.',

  extendedDescription:
    'To ease testing and development, if the provided "to" email address ends in "@example.com", ' +
    'then the email message will be written to the terminal instead of actually being sent.' +
    '(Thanks [@simonratner](https://github.com/simonratner)!)',

  inputs: {
    organization: {
      type: 'ref',
    },
    template: {
      description:
        'The relative path to an EJS template within our `views/emails/` folder -- WITHOUT the file extension.',
      extendedDescription:
        'Use strings like "foo" or "foo/bar", but NEVER "foo/bar.ejs".  For example, ' +
        '"marketing/welcome" would send an email using the "views/emails/marketing/welcome.ejs" template.',
      example: 'email-reset-password',
      type: 'string',
      required: true,
    },

    templateData: {
      description: 'A dictionary of data which will be accessible in the EJS template.',
      extendedDescription:
        'Each key will be a local variable accessible in the template.  For instance, if you supply ' +
        'a dictionary with a `friends` key, and `friends` is an array like `[{name:"Chandra"}, {name:"Mary"}]`),' +
        'then you will be able to access `friends` from the template:\n' +
        '```\n' +
        '<ul>\n' +
        '<% for (friend of friends){ %><li><%= friend.name %></li><% }); %>\n' +
        '</ul>\n' +
        '```' +
        '\n' +
        'This is EJS, so use `<%= %>` to inject the HTML-escaped content of a variable, `<%= %>` to skip HTML-escaping ' +
        'and inject the data as-is, or `<% %>` to execute some JavaScript code such as an `if` statement or `for` loop.',
      type: {},
      defaultsTo: {},
    },

    to: {
      description: 'The email address of the primary recipient.',
      extendedDescription:
        'If this is any address ending in "@example.com", then don\'t actually deliver the message. ' +
        'Instead, just log it to the console.',
      example: 'nola.thacker@example.com',
      required: true,
      isEmail: true,
    },

    toName: {
      description: 'Full name of the primary recipient.',
      example: 'Nola Thacker',
    },

    subject: {
      description: 'The subject of the email.',
      example: 'Hello there.',
      defaultsTo: '',
    },

    rawText: {
      type: 'string',
      defaultsTo: '',
    },

    from: {
      description: 'An override for the default "from" email that\'s been configured.',
      example: 'anne.martin@example.com',
      isEmail: true,
    },

    fromName: {
      description: 'An override for the default "from" name.',
      example: 'Anne Martin',
    },

    layout: {
      description:
        'Set to `false` to disable layouts altogether, or provide the path (relative ' +
        'from `views/layouts/`) to an override email layout.',
      defaultsTo: 'layout-email',
      custom: (layout) => layout === false || _.isString(layout),
    },

    bcc: {
      description: 'The email addresses of recipients secretly copied on the email.',
      example: ['jahnna.n.malcolm@example.com'],
    },

    headers: {
      type: 'ref',
    },
    // 利用するなら　https://nodemailer.com/message/attachments/ を参考に
    attachments: {
      type: 'ref',
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Email delivery report',
      outputDescription: 'A dictionary of information about what went down.',
      outputType: {
        loggedInsteadOfSending: 'boolean',
      },
    },
  },

  fn: async function ({
    organization,
    template,
    templateData,
    to,
    toName,
    subject,
    rawText,
    from,
    fromName,
    layout,
    bcc,
    headers,
    attachments,
  }) {
    var path = require('path');
    var url = require('url');
    var util = require('util');

    if (!_.startsWith(path.basename(template), 'email-')) {
      sails.log.warn(
        'The "template" that was passed in to `sendTemplateEmail()` does not begin with ' +
          '"email-" -- but by convention, all email template files in `views/emails/` should ' +
          'be namespaced in this way.  (This makes it easier to look up email templates by ' +
          'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n' +
          'Continuing regardless...'
      );
    }

    if (_.startsWith(template, 'views/') || _.startsWith(template, 'emails/')) {
      throw new Error(
        'The "template" that was passed in to `sendTemplateEmail()` was prefixed with\n' +
          '`emails/` or `views/` -- but that part is supposed to be omitted.  Instead, please\n' +
          'just specify the path to the desired email template relative from `views/emails/`.\n' +
          'For example:\n' +
          // eslint-disable-next-line quotes
          "  template: 'email-reset-password'\n" +
          'Or:\n' +
          // eslint-disable-next-line quotes
          "  template: 'admin/email-contact-form'\n" +
          // eslint-disable-next-line quotes
          " [?] If you're unsure or need advice, see https://sailsjs.com/support"
      );
    } //•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', template);
    var planeTextTemplatePath = path.join('emails/plane', template);
    var emailTemplateLayout;
    var planeTextTemplateLayout;
    if (layout) {
      emailTemplateLayout = path.relative(
        path.dirname(emailTemplatePath),
        path.resolve('layouts/', layout)
      );
      planeTextTemplateLayout = path.relative(
        path.dirname(planeTextTemplatePath),
        path.resolve('layouts/plane', layout)
      );
    } else {
      emailTemplateLayout = false;
      planeTextTemplateLayout = false;
    }

    var settings = {
      fromEmailAddress: sails.config.custom.backofficeMailAddress,
      fromName: 'Team Lycaon',
      notSendBackoffice: false,
      internalEmailAddress: sails.config.custom.backofficeMailAddress,
    };

    if (organization) {
      settings = await SysSettings.findOne({ organization: organization.id });
    }

    if (!templateData.fromName) {
      templateData.fromName = settings.fromName;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails
      .renderView(
        emailTemplatePath,
        _.extend({ layout: emailTemplateLayout, url, util }, templateData)
      )
      .intercept((err) => {
        err.message =
          'Could not compile view template.\n' +
          '(Usually, this means the provided data is invalid, or missing a piece.)\n' +
          'Details:\n' +
          err.message;
        return err;
      });

    if (!rawText) {
      rawText = await sails
        .renderView(
          planeTextTemplatePath,
          _.extend({ layout: planeTextTemplateLayout, url, util }, templateData)
        )
        .intercept((err) => {
          err.message =
            'Could not compile view template.\n' +
            '(Usually, this means the provided data is invalid, or missing a piece.)\n' +
            'Details:\n' +
            err.message;
          return err;
        });
    }
    // Sometimes only log info to the console about the email that WOULD have been sent.
    // Specifically, if the "To" email address is anything "@example.com".
    //
    // > This is used below when determining whether to actually send the email,
    // > for convenience during development, but also for safety.  (For example,
    // > a special-cased version of "user@example.com" is used by Trend Micro Mars
    // > scanner to "check apks for malware".)
    var isToAddressConsideredFake = Boolean(to.match(/@example\.com$/i));

    var notConfig = !sails.config.custom.smtpSettings || !sails.config.custom.smtpSettings.host;
    // If that's the case, or if we're in the "test" environment, then log
    // the email instead of sending it:
    var dontActuallySend =
      sails.config.environment === 'test' ||
      isToAddressConsideredFake ||
      notConfig ||
      sails.config.custom.isDemosite; //デモ環境

    if (dontActuallySend) {
      sails.log.info('Skipped sending email!');
      sails.log.debug(
        'Either because the "To" email address ended in "@example.com"\n' +
          'or because the current `sails.config.environment` is set to "test".\n' +
          'or sails.config.custom.smtpSettings is not set.\n' +
          '\n' +
          'But anyway, here is what WOULD have been sent:\n' +
          '-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-\n' +
          'To: ' +
          to +
          '\n' +
          'Subject: ' +
          subject +
          '\n' +
          '\n' +
          'Body:\n' +
          htmlEmailContents +
          '\n' +
          '-=-=-=-=-=-=-=-=-=-=-=-=-= ↓ rowtext ↓ =-=-=-=-=-=-=-=-=-=-=-=-=-\n' +
          rawText +
          '\n' +
          '-=-=-=-=-=-=-=-=-=-=-=-=-= ↑ rowtext ↑ =-=-=-=-=-=-=-=-=-=-=-=-=-'
      );
    } else {
      // Otherwise, we'll check that all required Mailgun credentials are set up
      // and, if so, continue to actually send the email.

      var subjectLinePrefix =
        sails.config.environment === 'production'
          ? ''
          : sails.config.environment === 'staging'
          ? '[FROM STAGING] '
          : '[FROM LOCALHOST] ';

      if (!from) {
        from = settings.fromEmailAddress;
      }

      if (!fromName) {
        fromName = settings.fromName;
      }

      var messageData = {
        headers: _.extend({ 'x-app-key': 'The Lycaon Team' }, headers),
        from: {
          name: fromName,
          address: from,
        },
        to: {
          name: toName,
          address: to,
        },
        bcc: bcc,
        subject: subjectLinePrefix + subject,
        text: rawText,
        html: htmlEmailContents,
        //https://nodemailer.com/message/attachments/
        attachments: attachments,
      };

      var sendBackoffice = function (messageData, transporter) {
        if (settings.notSendBackoffice) {
          sails.log.debug(
            'Skipped sending email, SysSettings is set to "notSendBackoffice === true".\n' +
              '\n' +
              'But anyway, here is what WOULD have been sent:\n' +
              '-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-\n' +
              'To: ' +
              to +
              '\n' +
              'Subject: ' +
              subject +
              '\n' +
              '\n' +
              'Body:\n' +
              htmlEmailContents +
              '\n' +
              '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-'
          );
          return;
        }

        //エラーの場合は、管理側にメール
        messageData.to.address = settings.internalEmailAddress;
        messageData.to.name = '';
        messageData.subject = `【メール配信不可 <${toName}>${to}】${messageData.subject}`;
        transporter.sendMail(messageData, (error, info) => {
          if (error) {
            sails.log.error(error);
            //エラーでも無視する
          } else {
            sails.log.info('Email sent backoffice: ' + info.response);
          }
        });
      };

      var transporter = nodemailer.createTransport(sails.config.custom.smtpSettings);
      transporter.verify((error) => {
        if (error) {
          sails.log.error(error);
          sendBackoffice(messageData, transporter);
        } else {
          transporter.sendMail(messageData, (error, info) => {
            if (error) {
              sails.log.error(error);
              sendBackoffice(messageData, transporter);
            } else {
              sails.log.info('Email sent: ' + info.response + ':' + messageData.to.address);
            }
          });
        }
      });
    } //ﬁ

    // All done!
    return {
      loggedInsteadOfSending: dontActuallySend,
    };
  },
};
