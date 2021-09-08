module.exports = {
  friendlyName: 'regexEscape',
  description: 'regex escape.',
  inputs: {
    str: {
      type: 'string',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    try {
      var reRegExp = /[\\^$.*+?()[\]{}|]/g;
      var reHasRegExp = new RegExp(reRegExp.source);

      return inputs.str && reHasRegExp.test(inputs.str) ? inputs.str.replace(reRegExp, '\\$&') : inputs.str;
    } catch (err) {
      sails.log.debug(err);
    }
    return inputs.str;
  },
};
