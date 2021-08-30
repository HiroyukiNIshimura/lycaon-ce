const flaverr = require('flaverr');

module.exports = {
  friendlyName: 'createThreadActivity',
  description: 'Create Activity utility.',
  inputs: {
    db: {
      type: 'ref',
      description: 'db instance',
      required: true,
    },
    type: {
      type: 'string',
      description: 'activity type',
      required: true,
      isIn: [
        'create',
        'update',
        'update-subject',
        'local',
        'update-category',
        'update-concept',
        'update-status',
        'update-duedate',
        'update-priority',
        'update-lock',
        'update-working',
        'responsible',
        'create-sneeze',
        'update-sneeze',
        'delete-sneeze',
        'create-reply',
        'update-reply',
        'delete-reply',
        'attach-file',
        'delete-file',
        'milestone',
        'relationship',
        'delete-relationship',
        'fork',
      ],
    },
    user: {
      type: 'ref',
      description: 'user instance',
      required: true,
    },
    thread: {
      type: 'ref',
      description: 'thread instance',
      required: true,
    },
    sneezeId: {
      type: 'number',
      description: 'sneeze.id',
    },
    replyId: {
      type: 'number',
      description: 'reply.id',
    },
    refId: {
      type: 'number',
      description: 'ref.thread.id',
    },
    fileName: {
      type: 'string',
    },
    botType: {
      type: 'string',
      description: 'similarity-bot | duedate-bot | reply-bot | tagify-bot',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function ({ db, type, user, thread, sneezeId, replyId, refId, fileName, botType }) {
    var rawData = '';
    var dudate;
    var userName;
    var stateWord;

    switch (type) {
      case 'create':
      case 'update':
      case 'update-subject':
      case 'local':
      case 'update-reply':
      case 'delete-reply':
      case 'update-sneeze':
      case 'delete-sneeze':
      case 'milestone':
        break;
      case 'update-category':
        var category = await Category.findOne({
          id: thread.category,
        });
        stateWord = category.name;
        break;
      case 'update-concept':
        stateWord = thread.concept === 0 ? 'draft' : 'published';
        break;
      case 'update-status':
        stateWord = thread.status === 1 ? 'close' : 'open';
        break;
      case 'update-duedate':
        if (thread.dueDateAt) {
          dudate = thread.dueDateAt;
        }
        break;
      case 'update-priority':
        stateWord = 'Normally';
        if (thread.priority === 0) {
          stateWord = 'Low';
        } else if (thread.priority === 2) {
          stateWord = 'High';
        }
        break;
      case 'update-lock':
        stateWord = thread.locked ? 'Archive' : 'Unarchive';
        break;
      case 'update-working':
        stateWord = thread.working ? 'Working' : 'Release work';
        break;
      case 'responsible':
        if (thread.responsible) {
          var responsible = await User.findOne({
            id: thread.responsible,
          });
          userName = responsible.fullName;
        }
        break;
      case 'create-sneeze':
        let sneeze = await Sneeze.findOne({ id: sneezeId }).usingConnection(db);
        if (sneeze) {
          rawData = sneeze.comment;
        }
        break;
      case 'create-reply':
        let reply = await Reply.findOne({ id: replyId }).usingConnection(db);
        if (reply) {
          rawData = reply.comment;
        }
        break;
      case 'attach-file':
        if (!fileName) {
          throw flaverr('E_REQUIRED', new Error('attach-file need fullName!'));
        }
        break;
      case 'delete-file':
        if (!fileName) {
          throw flaverr('E_REQUIRED', new Error('delete-file need fullName!'));
        }
        break;
      case 'relationship':
      case 'delete-relationship':
      case 'fork':
        if (refId) {
          var refThread = await Thread.findOne({ id: refId }).usingConnection(db);
          if (refThread) {
            stateWord = `#${refThread.no}`;
          }
        }
        break;
      default:
        break;
    }

    var valueSets = {
      type: type,
      team: thread.team,
      thread: thread.id,
      sneeze: sneezeId,
      reply: replyId,
      user: user.id,
      rawData: rawData,
    };

    if (fileName) {
      valueSets.fileName = fileName;
    }

    if (userName) {
      valueSets.userName = userName;
    }

    if (stateWord) {
      valueSets.stateWord = stateWord;
    }
    if (botType) {
      valueSets.stateWord = botType;
    }

    if (dudate) {
      valueSets.targetDate = dudate;
    }

    await Thread.updateOne({
      id: thread.id,
    })
      .set({ accessCount: thread.accessCount + 1 })
      .usingConnection(db);

    await ThreadActivity.create(valueSets).usingConnection(db);
  },
};
