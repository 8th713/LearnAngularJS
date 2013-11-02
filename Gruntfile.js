'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    markdown: {
      article: {
        files: [
          {
            expand: true,
            src: [
              'guide/**/*.md',
              'account/**/*.md',
              'todo/**/*.md'
            ],
            dest: './',
            ext: '.html'
          }
        ],
        options: {
          template: '_template.html',
          markdownOptions: {
            sanitize: false,
            highlight: 'manual'
          }
        }
      }
    },
    esteWatch: {
      options: {
        dirs: [
          './',
          'assets/**/',
          'guide/**/',
          'account/**/',
          'todo/**/',
          '!components/**/',
          '!node_modules/**/',
        ],
        ignoredFiles: [
          'README.md'
        ],
        livereload: {
          enabled: true,
          port: 35729,
          extensions: ['js', 'css', 'html']
        }
      },
      md: function (filepath) {
        var files = [{
          expand: true,
          src: filepath,
          ext: '.html'
        }];
        grunt.config.set('markdown.article.files', files);
        return 'markdown:article';
      }
    },
    connect: {
      app: {
        options: {
          port: 9000,
          livereload: true,
          open: 'http://localhost:9000/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-este-watch');

  grunt.registerTask('default',  ['connect', 'esteWatch']);
};
