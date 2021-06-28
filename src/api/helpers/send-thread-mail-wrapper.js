const moment = require('moment');
const url = require('url');

module.exports = {
  friendlyName: 'Send Thread mail utility',
  description: 'Send Thread mail utility.',
  inputs: {
    thread: {
      type: 'number',
      description: 'thread.id',
      required: true,
    },
    action: {
      type: 'string',
      isIn: [
        'create',
        'update',
        'status',
        'concept',
        'responsible',
        'archive',
        'priority',
        'dueDate',
        'working',
        'sneeze',
        'reply',
      ],
      defaultsTo: 'create',
      description: 'action',
    },
    sneeze: {
      type: 'number',
    },
    reply: {
      type: 'number',
    },
    hashTag: {
      type: 'string',
    },
    db: {
      type: 'ref',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var thread = await Thread.findOne({ id: inputs.thread })
      .populate('team')
      .populate('category')
      .populate('tags', {
        sort: 'name',
      })
      .populate('responsible')
      .populate('owner')
      .populate('lastUpdateUser')
      .populate('workingUser')
      .usingConnection(inputs.db);

    if (thread.local) {
      return;
    }

    var team = await Team.findOne({ id: thread.team.id })
      .populate('users', { where: { isNologin: false, isSandbox: false, deleted: false } })
      .populate('emailNoThankYous')
      .populate('organization');

    var settings = await SysSettings.findOne({ organization: team.organization.id });
    if (settings.notMailSend) {
      sails.log.debug('システム設定でメール送信は実行しない状態です。');
      return;
    }

    var tags = thread.tags.map((o) => {
      return o.name;
    });
    var updater = thread.lastUpdateUser ? thread.lastUpdateUser : thread.owner;

    var getAction = async function (thread) {
      var action = '';
      var shortAction = '';
      var comment = '';
      var sneeze = {};
      var reply = {};

      switch (inputs.action) {
        case 'create':
          action = sails.__('A new thread has been created');
          shortAction = sails.__('(New)');
          break;
        case 'update':
          action = sails.__('The thread has been updated_2');
          shortAction = sails.__('(update)');
          break;
        case 'status':
          if (thread.status === 0) {
            // eslint-disable-next-line quotes
            action = sails.__("The thread state has changed to 'open'");
            shortAction = sails.__('(open)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The thread state has changed to 'closed'");
            shortAction = sails.__('(closed)');
          }
          break;
        case 'concept':
          if (thread.concept === 0) {
            // eslint-disable-next-line quotes
            action = sails.__("The thread concept has been changed to 'draft'");
            shortAction = sails.__('(draft)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The thread concept has changed to 'public'");
            shortAction = sails.__('(published)');
          }
          break;
        case 'responsible':
          if (thread.responsible) {
            action = sails
              .__('The person in charge of the thread has been changed to {0}')
              .format(thread.responsible.fullName);
            shortAction = sails.__('(responsible)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The person in charge of the thread has been changed to 'Not set'");
            shortAction = sails.__('(Release of charge)');
          }
          break;
        case 'archive':
          if (thread.locked) {
            // eslint-disable-next-line quotes
            action = sails.__("The thread is now an 'archive'");
            shortAction = sails.__('(archive)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The thread has been 'unarchived'");
            shortAction = sails.__('(unarchive)');
          }
          break;
        case 'priority':
          shortAction = sails.__('(importance)');
          if (thread.priority === 0) {
            // eslint-disable-next-line quotes
            action = sails.__("Thread importance changed to 'Low'");
          } else if (thread.priority === 1) {
            // eslint-disable-next-line quotes
            action = sails.__("Thread importance changed to 'Normally'");
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("Thread importance changed to 'High'");
          }
          break;
        case 'dueDate':
          if (thread.dueDateAt) {
            action = sails
              // eslint-disable-next-line quotes
              .__("The thread deadline has been changed to '{0}'")
              .format(moment(Number(thread.dueDateAt)).format('YYYY/MM/DD'));
            shortAction = sails.__('(Deadline)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The thread deadline has been changed to 'Not set'");
            shortAction = sails.__('(Cancellation of deadline)');
          }
          break;
        case 'working':
          if (thread.working) {
            action = sails.__('The thread is working with {0}').format(thread.workingUser.fullName);
            shortAction = sails.__('(working)');
          } else {
            // eslint-disable-next-line quotes
            action = sails.__("The thread's Working has been released");
            shortAction = sails.__('(Cancellation of work)');
          }
          break;
        case 'sneeze':
          shortAction = sails.__('(comment)');
          sneeze = await Sneeze.findOne({ id: inputs.sneeze })
            .populate('owner')
            .usingConnection(inputs.db);

          action = sails.__('A comment was added by {0}').format(sneeze.owner.fullName);
          comment = sneeze.comment;
          break;
        case 'reply':
          shortAction = sails.__('(reply)');
          reply = await Reply.findOne({ id: inputs.reply })
            .populate('owner')
            .usingConnection(inputs.db);

          action = sails.__('A reply was added by {0}').format(reply.owner.fullName);
          reply.comment;
          comment = reply.comment;
          break;
        default:
          break;
      }

      return {
        action: action,
        shortAction: shortAction,
        comment: comment,
        sneeze: sneeze,
        reply: reply,
        activity: inputs.action,
      };
    };

    var getTempData = async function (settings, thread, updater, action, team) {
      var userName = updater.fullName;
      var updatedAt = moment(Number(thread.lastHumanUpdateAt)).format('llll') + ' <JST>';

      if (action.activity === 'sneeze') {
        userName = action.sneeze.owner.fullName;
        updatedAt = moment(Number(action.sneeze.updatedAt)).format('llll') + ' <JST>';
      }

      if (action.activity === 'reply') {
        userName = action.reply.owner.fullName;
        updatedAt = moment(Number(action.reply.updatedAt)).format('llll') + ' <JST>';
      }

      return {
        organization: team.organization,
        team: {
          id: thread.team.id,
          name: thread.team.name,
        },
        thread: {
          id: thread.id,
          no: thread.no,
          category: thread.category.name,
          status: thread.status === 0 ? sails.__('open') : sails.__('close'),
          concept: thread.concept === 0 ? sails.__('draft') : sails.__('published'),
          responsible: thread.responsible ? thread.responsible.fullName : '',
          dueDate: thread.dueDate
            ? moment(Number(thread.dueDateAt)).format('YYYY/MM/DD') + ' <JST>'
            : '',
          tags: tags.length > 0 ? tags.join(', ') : '',
        },
        title: `[#${thread.no}] ${thread.subject}`,
        threadBody: await sails.helpers.mdToHtml.with({
          markdown: thread.body,
        }),
        safeThreadBody: await sails.helpers.mdToSanitize.with({
          markdown: thread.body,
        }),
        //markdown: thread.body,
        updater: userName,
        updatedAt: updatedAt,
        action: action.action,
        comment: await sails.helpers.mdToHtml.with({
          markdown: action.comment,
        }),
        safeComment: await sails.helpers.mdToSanitize.with({
          markdown: action.comment,
        }),
        hashTag: inputs.hashTag,
        fromName: settings.fromName,
        threadLink: url.resolve(
          sails.config.custom.baseUrl,
          `${team.organization.handleId}/thread/${thread.no}`
        ),
        settingUrl: url.resolve(
          sails.config.custom.baseUrl,
          `${team.organization.handleId}/account/profile#mail-settings`
        ),
      };
    };

    var current = sails.hooks.i18n.getLocale();
    var act = await getAction(thread);

    for (let user of team.users) {
      if (_.findIndex(team.emailNoThankYous, { id: user.id }) < 0) {
        //
        if (user.notNeedMyOwnEmail) {
          if (act.activity === 'sneeze') {
            if (act.sneeze.owner.id === user.id) {
              sails.log.debug('notNeedMyOwnEmail!(sneeze)' + user.fullName);
              continue;
            }
          } else if (act.activity === 'reply') {
            if (act.reply.owner.id === user.id) {
              sails.log.debug('notNeedMyOwnEmail!(reply)' + user.fullName);
              continue;
            }
          } else {
            if (updater.id === user.id) {
              sails.log.debug('notNeedMyOwnEmail!' + user.fullName);
              continue;
            }
          }
        }

        var mailHeaders = { 'x-lycaon-team-id': thread.team.id };

        var entity = await User.findOne({ id: user.id })
          .populate('sendMailTags')
          .populate('sendMailCategories')
          .usingConnection(inputs.db);

        var filterCategory = false;
        var filterTag = false;

        if (entity.sendMailCategories.length > 0) {
          mailHeaders['x-lycaon-categories-filter'] = entity.sendMailCategories
            .map((o) => o.name)
            .join(',');

          let exists = _.intersection(
            entity.sendMailCategories.map((o) => o.id),
            [thread.category.id]
          );
          if (exists.length < 1) {
            filterCategory = true;
            sails.log.debug('notfound category!' + user.fullName);
          }
        }

        if (entity.sendMailTags.length > 0) {
          mailHeaders['x-lycaon-tags-filter'] = entity.sendMailTags.map((o) => o.name).join(',');

          let exists = _.intersection(
            entity.sendMailTags.map((o) => o.id),
            thread.tags.map((o) => o.id)
          );
          if (exists.length < 1) {
            filterTag = true;
            sails.log.debug('notfound tags!' + user.fullName);
          }
        }

        if (filterCategory && filterTag) {
          sails.log.debug('skip sendmail!' + user.fullName);
          continue;
        }

        var lang = user.languagePreference ? user.languagePreference : 'en';
        sails.hooks.i18n.setLocale(lang);
        moment.locale(lang);

        var templateData = await getTempData(settings, thread, updater, act, team);
        templateData.locale = lang;

        var data = {
          organization: team.organization,
          template: 'email-thread-notify',
          subject: `${thread.team.name} | [#${thread.no}] ${act.shortAction} ${thread.subject}`,
          to: user.emailAddress,
          toName: user.fullName,
          headers: mailHeaders,
          templateData: templateData,
        };

        await sails.helpers.agendaSchedule.with({
          ttl: Date.now() + sails.config.custom.mailSendTTL,
          job: 'send-email',
          data: data,
        });
      }
    }

    sails.hooks.i18n.setLocale(current);
    moment.locale(current);
  },
};
