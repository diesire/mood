'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        nodeunit: {
            lib: ['test/mood_test.js'],
            server: ['test/server_test.js'],
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
                src: ['server/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
        },
        jsbeautifier: {
            gruntfile: {
                src: '<%= jshint.gruntfile.src %>'
            },
            lib: {
                src: '<%= jshint.lib.src %>',
            },
            test: {
                src: '<%= jshint.test.src %>',
            },
            server: {
                src: '<%= jshint.server.src %>',
            },
            options: {
                indent_size: 4,
                indent_char: " ",
                indent_level: 0,
                indent_with_tabs: false,
                preserve_newlines: true,
                max_preserve_newlines: 10,
                jslint_happy: false,
                brace_style: "collapse",
                keep_array_indentation: false,
                keep_function_indentation: false,
                space_before_conditional: true,
                eval_code: false,
                indent_case: false,
                wrap_line_length: 80,
                unescape_strings: false
            }
        },
        express: {
            options: {
                args: [],
                // Setting to `false` will effectively just run `node path/to/server.js`
                background: true,

                // Called if spawning the server fails
                error: function(err, result, code) {
                    grunt.log.writeln(err.stderr);
                },

                // Called when the spawned server throws errors
                fallback: function() {
                    grunt.log.writeln('Error fallback');
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
                tasks: ['jsbeautifier:gruntfile', 'jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jsbeautifier:lib', 'jshint:lib']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jsbeautifier:test', 'jshint:test']
            },
            server: {
                files: '<%= jshint.server.src %>',
                tasks: ['jsbeautifier:server', 'jshint:server']
            }
            //            ,
            //            express: {
            //                files: ['<%= jshint.lib.src %>', '<%= jshint.test.src %>',
            //                        '<%= jshint.server.src %>'
            //                ],
            //                tasks: ['jshint', 'express:dev', 'nodeunit'],
            //                options: {
            //                    nospawn: false //Without this option specified express won't be reloaded
            //                }
            //            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Default task.
    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'watch']);
    grunt.registerTask('test', ['express:dev', 'nodeunit']);
};
