module.exports = {
  friendlyName: 'createPassword',
  description: 'Create new password.',
  inputs: {
    passwordLength: {
      type: 'number',
      description: 'password length',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var length = inputs.passwordLength ? inputs.passwordLength : 10;
    var passwordBase = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&()=~|@[];:+-*<>?_>.,\'';
    var password = '';
    for (let i = 0; i < length; i++) {
      password += passwordBase.charAt(Math.floor(Math.random() * passwordBase.length));
    }
    return password;
  },
};
