/**
 * `tasks/register/prod.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed instead of `default` when
 * your Sails app is lifted in a production environment (e.g. using
 * `NODE_ENV=production node app`).
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/prod.js
 *
 */
module.exports = function (grunt) {
  if (process.env.JOB_SERVICE || process.env.DB_MIGRATION) {
    grunt.registerTask('prod', []);
  } else {
    grunt.registerTask('prod', [
      'polyfill:prod', //« Remove this to skip transpilation in production (not recommended)
      'compileAssets',
      'babel', //« Remove this to skip transpilation in production (not recommended)
      'concat',
      'uglify',
      'cssmin',
      'rename',
      'sails-linker:prodJs',
      'sails-linker:prodStyles',
    ]);
  }
};
