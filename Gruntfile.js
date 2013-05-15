'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        nodeunit: {
            files: ['test/**/*_test.js'],
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js']
            },
            server: {
                src: ['server/server.js']
            },
            test: {
                src: ['test/**/*.js']
            },
        },
        express: {
            options: {
                args: [],
                // Setting to `false` will effectively just run `node path/to/server.js`
                background: true,

                // Called if spawning the server fails
                error: function (err, result, code) {
                    grunt.writeln(err.stderr);
                },

                // Called when the spawned server throws errors
                fallback: function () {
                    grunt.writeln('Error fallback');
                },

                // Override node env's PORT
                //port: 3000
            },
            dev: {
                options: {
                    script: 'server/server.js'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            express: {
                files: ['<%= jshint.lib.src %>', '<%= jshint.test.src %>', 'server/server.js'],
                tasks: ['jshint', 'express:dev', 'nodeunit'],
                options: {
                    nospawn: false //Without this option specified express won't be reloaded
                }
            }
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', 'nodeunit']);
    grunt.registerTask('test', ['express:dev', 'nodeunit']);
    grunt.registerTask('server', ['express:dev', 'watch']);
    grunt.registerTask('stop', ['express:dev:stop']);

};