var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  grunt.config.set('i18ndic', {
    dev: {
      files: [
        {
          expand: true,
          cwd: 'config/locales/',
          src: ['*.json', '!work.json'],
          dest: 'assets/js/utilities/locales/',
          ext: '.js',
        },
      ],
    },
  });

  grunt.registerMultiTask('i18ndic', 'Create i18nDic.', function () {
    if (this.files.length < 1) {
      grunt.verbose.warn('Destination not written because no source files were provided.');
    }

    this.files.forEach(function (filePair) {
      var locale = path.basename(filePair.dest).replace('.js', '');
      var jsonObject = JSON.parse(fs.readFileSync(filePair.src[0], 'utf8'));
      locale = locale.replace('-', '_');
      var js = `const lycaon_lang_${locale} = ` + JSON.stringify(jsonObject) + ';';
      fs.writeFileSync(filePair.dest, js);
      grunt.log.ok('File ' + filePair.dest + ' created');
    });
  });
};
