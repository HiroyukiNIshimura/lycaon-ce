module.exports = {
  friendlyName: 'Markdown to html',
  description: 'Markdown to html utility.',
  inputs: {
    markdown: {
      type: 'string',
      description: 'markdown text',
    },
    prettyPrint: {
      type: 'boolean',
      description: 'use prettyPrint',
      defaultsTo: false,
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    if (!inputs.markdown) {
      return '';
    }

    var md = require('markdown-it')();
    var html = require('html');

    if (inputs.prettyPrint) {
      return html.prettyPrint(md.render(inputs.markdown));
    }
    return md.render(inputs.markdown);
  },
};
