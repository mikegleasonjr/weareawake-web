module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // -----------------------------------------

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT Z") %> */',
        sourceMapRoot: '/'
      },
      lib: {
        options: {
          sourceMap: 'static/js/lib-<%= pkg.version %>.map.js',
          sourceMappingURL: '/static/js/lib-<%= pkg.version %>.map.js'
        },
        files: [{
          src: [
            'static/js/lib/jquery-2.0.3.js',
            'static/js/lib/handlebars.runtime-1.1.2.js',
            'static/js/lib/ember-1.2.0.js'
          ],
          dest: 'static/js/lib-<%= pkg.version %>.min.js'
        }]
      },
      app: {
        options: {
          sourceMap: 'static/js/app-<%= pkg.version %>.map.js',
          sourceMappingURL: '/static/js/app-<%= pkg.version %>.map.js'
        },
        files: [{
          src: 'static/js/app/**/*.js',
          dest: 'static/js/app-<%= pkg.version %>.min.js'
        }]
      }
    },

    // -----------------------------------------

    less: {
      options: {
        compress: true,
        sourceMap: true,
        sourceMapFilename: 'static/css/app-<%= pkg.version %>.map.css',
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
          dest: 'static/css/app-<%= pkg.version %>.min.css'
        }]
      }
    },

    // -----------------------------------------

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

    // -----------------------------------------

    watch: {
      'uglify:lib': {
        files: ['static/js/lib/**/*.js'],
        tasks: ['uglify:lib']
      },
      'uglify:app': {
        files: ['static/js/app/**/*.js'],
        tasks: ['uglify:app']
      },
      'less:app': {
        files: ['static/css/app/**/*.less'],
        tasks: ['less:app']
      },
      handlebars: {
        files: 'views/partials/**/*.handlebars',
        tasks: ['handlebars']
      }
    },

    // -----------------------------------------

    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'archives/<%= pkg.name %>-<%= pkg.version %>-<%= pkg.revision %>.tar.gz'
        },
        files: [{
            src: ['app.js', 'package.json', 'routes/**/*.*', 'static/**/*.*', 'views/**/*.*'],
            dest:'<%= pkg.name %>-<%= pkg.version %>-<%= pkg.revision %>/'
        }]
      }
    },

    // -----------------------------------------

    'git-describe': {
      options: {
        template: '{%=object%}{%=dirty%}'
      },
      commit: { }
    },

    // -----------------------------------------

    clean: [
      'static/js/app/handlebars-partials.js',
      'static/js/*.min.js',
      'static/js/*.map.js',
      'static/css/*.min.css',
      'static/css/*.map.css'
    ]
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-git-describe');

  grunt.event.once('git-describe', function (rev) {
    console.log('---------------');
    grunt.config.set('pkg.revision', rev);
  });

  grunt.event.on('default', function () {
    console.log('---------------');
  });

  grunt.registerTask('archive', ['git-describe', 'compress']);
  grunt.registerTask('default', ['clean', 'handlebars', 'uglify', 'less', 'archive']);
};
