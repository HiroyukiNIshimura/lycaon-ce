module.exports = {
  friendlyName: 'Create new password',
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
    var password_base =
      '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&()=~|@[];:+-*<>?_>.,\'';
    var password = '';
    for (let i = 0; i < length; i++) {
      password += password_base.charAt(Math.floor(Math.random() * password_base.length));
    }
    return password;
  },
};
