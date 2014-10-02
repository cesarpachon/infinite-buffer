module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['specs/**/*.js', 'src/*.js'],
      tasks: ['jshint', 'jasmine']
    },
    jasmine: {
      test:{
        src :[
          'src/*.js'
        ],
        options: {
          specs : 'specs/**/*spec.js',
          helpers : 'specs/helpers/*.js',
          timeout : 10000
        }
      }
    }
    jshint: {
      options:{
        jshintrc:true
      },
      target:{
        src:['src/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['watch']);
};
