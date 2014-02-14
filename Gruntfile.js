var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        sourceMap: true
      },
      lib: {
        options: {
          sourceMapName: 'static/js/lib.map.js'
        },
        files: [{
          src: [
            'static/js/lib/jquery-2.0.3.js',
            'static/js/lib/handlebars.runtime-1.1.2.js',
            'static/js/lib/bootstrap.js'
          ],
          dest: 'static/js/lib.min.js'
        }]
      },
      app: {
        options: {
          sourceMapName: 'static/js/app.map.js'
        },
        files: [{
          src: [
            'static/js/app/app.js',
            'static/js/app/handlebars-partials.js',
            'static/js/app/googlemaps/loader.js',
            'static/js/app/widgets/widget.js',
            'static/js/app/widgets/handlebars.js',
            'static/js/app/widgets/map.js'
          ],
          dest: 'static/js/app.min.js'
        }]
      }
    },
    jshint: {
      options: {
        ignores: ['static/js/app/handlebars-partials.js']
      },
      all: [
        'static/js/app/**/*.js',
        'lib/**/*.js',
        'deploy.js'
      ]
    },
    sass: {
      options: {
        //sourceComments: 'map',
        outputStyle: 'compressed'
      },
      lib: {
        options: {
          //sourceMap: 'static/css/lib.map.css'
        },
        files: {
          'static/css/lib.min.css': 'static/css/lib/lib.scss'
        }
      },
      app: {
        options: {
          //sourceMap: 'static/css/app.map.css'
        },
        files: {
          'static/css/app.min.css': 'static/css/app/app.scss'
        }
      }
    },
    handlebars: {
      partials: {
        options: {
          namespace: 'Handlebars.templates',
          partialRegex: /.*/,
          partialsPathRegex: /\/partials\//,
          processPartialName: function(filePath) {
            return filePath.replace('views/partials/', '').replace('.handlebars', '');
          }
        },
        files: [{
          src: 'views/partials/**/*.handlebars',
          dest:'static/js/app/handlebars-partials.js'
        }]
      }
    },
    watch: {
      'uglify:lib': {
        files: ['static/js/lib/**/*.*'],
        tasks: ['clean:libjs', 'uglify:lib', 'md5:libjs', 'replace:handlebars']
      },
      'uglify:app': {
        files: ['static/js/app/**/*.*'],
        tasks: ['clean:appjs', 'uglify:app', 'md5:appjs', 'replace:handlebars']
      },
      'sass:lib': {
        files: ['static/css/lib/**/*.*'],
        tasks: ['clean:libcss', 'sass:lib', 'md5:libcss', 'replace:handlebars']
      },
      'sass:app': {
        files: ['static/css/app/**/*.*'],
        tasks: ['clean:appcss', 'sass:app', 'md5:appcss', 'replace:handlebars']
      },
      handlebars: {
        files: 'views/partials/**/*.handlebars',
        tasks: ['handlebars']
      }
    },
    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'archives/<%= pkg.name %>-<%= pkg.version %>-<%= pkg.revision %>.tar.gz'
        },
        files: [{
            src: ['app.js', 'package.json', 'lib/**/*.js', 'locales/*.js', 'static/**/*.*', 'views/**/*.*'],
            dest:'<%= pkg.name %>-<%= pkg.version %>-<%= pkg.revision %>/'
        }]
      }
    },
    'git-describe': {
      options: {
        template: '{%=object%}{%=dirty%}'
      },
      commit: { }
    },
    clean: {
      appjs: [
        'static/js/app.*.js'
      ],
      libjs: [
        'static/js/lib.*.js'
      ],
      appcss: [
        'static/css/app.*.css'
      ],
      libcss: [
        'static/css/lib.*.css'
      ]
    },
    md5: {
      options: {
        encoding: null,
        keepBasename: true,
        keepExtension: true,
        afterEach: function (fileChange) {
          grunt.file.delete(fileChange.oldPath);
          grunt.config.set('md5:' + path.basename(fileChange.oldPath).replace(/\./g, '/'), path.basename(fileChange.newPath));
        }
      },
      'libjs': {
        files: [
          { 'static/js/': 'static/js/lib.map.js' },
          { 'static/js/': 'static/js/lib.min.js' }
        ]
      },
      'appjs': {
        files: [
          { 'static/js/': 'static/js/app.map.js' },
          { 'static/js/': 'static/js/app.min.js' }
        ]
      },
      'libcss': {
        files: [
          { 'static/css/': 'static/css/lib.map.css' },
          { 'static/css/': 'static/css/lib.min.css' }
        ]
      },
      'appcss': {
        files: [
          { 'static/css/': 'static/css/app.map.css' },
          { 'static/css/': 'static/css/app.min.css' }
        ]
      }
    },
    replace: {
      handlebars: {
        src: [
          'views/layouts/main.handlebars',
          'static/js/*.js',
          'static/css/*.css',
          'test/browser/mocha.html'
        ],
        overwrite: true,
        replacements: [{
          from: /(app|lib)\.(min|map)(-[a-fA-F0-9]{32})?\.(js|css)/g,
          to: function(matchedWord) {
            var m = /(app|lib)\.(min|map)(-[a-fA-F0-9]{32})?\.(js|css)/g.exec(matchedWord);
            return grunt.config.get('md5:' + m[1] + '/' + m[2] + '/' + m[4]) || matchedWord;
          }
        }]
      }
    },
    mochaTest: {
      test: {
        src: ['test/server/**/*.js']
      }
    },
    mocha: {
      test: {
        src: ['test/browser/mocha.html']
      }
    },
    connect: {
      server: {
        options: {
          port: 8001
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.event.once('git-describe', function (rev) {
    grunt.config.set('pkg.revision', rev);
  });

  grunt.registerTask('static', ['handlebars', 'uglify', 'sass', 'md5', 'replace']);
  grunt.registerTask('test-only', ['jshint', 'mocha', 'mochaTest']);
  grunt.registerTask('test', ['clean', 'static', 'test-only']);
  grunt.registerTask('archive', ['git-describe', 'compress']);
  grunt.registerTask('dev', ['clean', 'static', 'connect', 'watch']);

  grunt.registerTask('default', ['test', 'archive']);
};
