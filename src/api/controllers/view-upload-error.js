module.exports = {
  friendlyName: 'View upload error',

  description: 'Display "Upload error" page.',

  inputs: {
    type: {
      type: 'string',
      isIn: ['thread', 'wiki', 'vote'],
      required: true,
    },
    id: {
      type: 'number',
      required: true,
    },
    plan: {
      type: 'string',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/upload-error',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var model = {};
    if (inputs.type === 'thread') {
      model = await Thread.findOne({ id: inputs.id });
    } else if (inputs.type === 'wiki') {
      model = await Wiki.findOne({ id: inputs.id });
    } else {
      model = await Vote.findOne({ id: inputs.id });
    }

    if (!model) {
      throw 'notfound';
    }

    return { type: inputs.type, model: model, plan: inputs.plan };
  },
};
