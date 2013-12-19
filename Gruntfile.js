module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        sourceMapRoot: '/'
      },
      lib: {
        options: {
          sourceMap: 'static/js/lib.map.js',
          sourceMappingURL: '/static/js/lib.map.js'
        },
        files: [{
          src: [
            'static/js/lib/jquery-2.0.3.js',
            'static/js/lib/handlebars.runtime-1.1.2.js'
          ],
          dest: 'static/js/lib.min.js'
        }]
      },
      app: {
        options: {
          sourceMap: 'static/js/app.map.js',
          sourceMappingURL: '/static/js/app.map.js'
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
    less: {
      options: {
        compress: true,
        sourceMap: true,
        sourceMapFilename: 'static/css/app.map.css',
        sourceMapRootpath: '/'
      },
//      lib: {
//        files: [{
//          src: [
//            'static/js/lib/jquery-2.0.3.js',
//            'static/js/lib/handlebars.runtime-1.1.2.js',
//            'static/js/lib/ember-1.2.0.js'
//          ],
//          dest: 'static/js/lib.min.js'
//        }]
//      },
      app: {
        files: [{
          src: 'static/css/app/**/*.less',
          dest: 'static/css/app.min.css'
        }]
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
        files: ['static/js/lib/**/*.js'],
        tasks: ['clean:libjs', 'uglify:lib', 'md5:libjs', 'replace:handlebars']
      },
      'uglify:app': {
        files: ['static/js/app/**/*.js'],
        tasks: ['clean:appjs', 'uglify:app', 'md5:appjs', 'replace:handlebars']
      },
      'less:app': {
        files: ['static/css/app/**/*.less'],
        tasks: ['clean:appcss', 'less:app', 'md5:appcss', 'replace:handlebars']
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
            src: ['app.js', 'package.json', 'locales/*.js', 'routes/**/*.*', 'static/**/*.*', 'views/**/*.*'],
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
      ]
    },
    md5: {
      options: {
        encoding: null,
        keepBasename: true,
        keepExtension: true,
        afterEach: function (fileChange) {
          grunt.file.delete(fileChange.oldPath);
          grunt.config.set('md5:' + fileChange.oldPath.replace(/\./g, '/'), fileChange.newPath);
          console.log('--- setting', 'md5:' + fileChange.oldPath.replace(/\./g, '/'))
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
          from: /static\/(js|css)\/(app|lib)\.(min|map)(-[a-fA-F0-9]{32})?\.(js|css)/g,
          to: function(matchedWord) {
            var m = /static\/(js|css)\/(app|lib)\.(min|map)(-[a-fA-F0-9]{32})?\.(js|css)/g.exec(matchedWord);
            return grunt.config.get('md5:static/' + m[1] + '/' + m[2] + '/' + m[3] + '/' + m[1]) || matchedWord;
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

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-git-describe');
  grunt.loadNpmTasks('grunt-md5');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.event.once('git-describe', function (rev) {
    grunt.config.set('pkg.revision', rev);
  });

  grunt.registerTask('dev', ['clean', 'handlebars', 'uglify', 'less', 'md5', 'replace', 'connect', 'watch']);
  grunt.registerTask('test', ['mocha', 'mochaTest']);
  grunt.registerTask('archive', ['git-describe', 'compress']);
  grunt.registerTask('default', ['clean', 'handlebars', 'uglify', 'less', 'md5', 'replace', 'test', 'archive']);
};
