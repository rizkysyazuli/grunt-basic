module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        conf: grunt.file.readJSON('config.json'),

        // compile scss using compass
        compass: {
            dist: {
                options: {
                    sourcemap: true,
                    sassDir: '<%= conf.asset_path %>/scss',
                    cssDir: '<%= conf.asset_path %>/css',
                    imagesDir: '<%= conf.asset_path %>/img',
                    javascriptsDir: '<%= conf.asset_path %>/js',
                    fontsDir: '<%= conf.asset_path %>/fonts',
                    outputStyle: 'compressed',
                    relativeAssets: true,
                    noLineComments: true,
                    httpPath: '/'
                    // list of compass plugins, if any
                    // require: ['zurb-foundation', 'susy']
                }
            }
        },

        // add/remove vendor prefixes
        autoprefixer: {
            options: {
                browsers: ['last 2 versions'],
                map: true
            },
            css: {
                files: [{
                    src: '<%= conf.asset_path %>/css/main.css',
                    dest: '<%= conf.asset_path %>/css/main.css'
                }]
            }
        },

        // minify images
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: '<%= conf.asset_path %>/img',
                    src: '**/*.{gif,jpeg,jpg,png,svg}',
                    dest: '<%= conf.asset_path %>/img'
                }]
            }
        },

        // compress JS files.
        // add additional scripts in the "files" config below
        uglify: {
            options: {
                mangle: false,
                sourceMap: true,
                report: 'none',
                preserveComments: false,
                compress: {
                    // drop_debugger: true,
                    // join_vars: true,
                    // drop_console: true
                }
            },
            all: {
                files: [{
                    src: [
                        '<%= conf.asset_path %>/js/src/plugins.js',
                        '<%= conf.asset_path %>/js/src/main.js'
                    ],
                    dest: '<%= conf.asset_path %>/js/dist/main.min.js'
                }]
            }
        },

        // inject js & css dependencies
        wiredep: {
            main: {
                src: [
                    '<%= conf.template_path %>/**/*.{html,php}',
                    '<%= conf.asset_path %>/scss/**/*.scss'
                ]
            }
        },

        // folder cleanup
        clean: {
            css: ['<%= conf.asset_path %>/css/*.css'],
            js: ['<%= conf.asset_path %>/js/dist/*.js'],
            images: ['<%= conf.asset_path %>/img/dist']
        },

        // linters & validators
        sasslint: {
            options: {
                configFile: '.sass-lint.yml'
            },
            target: ['<%= conf.asset_path %>/scss/**/*.scss']
        },

        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: ['<%= conf.asset_path %>/js/src/*.js']
        },

        htmlhint: {
            options: {
                htmlhintrc: '.htmlhintrc'
            },
            html: {
                src: ['<%= conf.template_path %>/**/*.{html,php}']
            }
        },

        // file watcher & task runner for all the previous actions above
        watch: {
            options: {
                spawn: false
            },
            grunt: {
                files: 'Gruntfile.js'
            },
            bower: {
                files: 'bower.json',
                tasks: ['wiredep']
            },
            styles: {
                files: '<%= conf.asset_path %>/scss/**/*.scss',
                tasks: ['compass', 'autoprefixer']
            },
            scripts: {
                files: '<%= conf.asset_path %>/js/src/*.js',
                tasks: ['uglify']
            },
            images: {
                files: '<%= conf.asset_path %>/img/**/*.{gif,jpeg,jpg,png,svg}',
                tasks: ['newer:imagemin']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        // auto reload on these changes (compiled files)
                        '<%= conf.asset_path %>/css/*.css',
                        '<%= conf.asset_path %>/js/dist/*.min.js',
                        '<%= conf.asset_path %>/img/**/*.{gif,jpeg,jpg,png,svg}',
                        '<%= conf.asset_path %>/**/*.{json,txt}',
                        '<%= conf.template_path %>/**/*.{html,php}'
                    ]
                },
                options: {
                    proxy: '<%= conf.base_url %>',
                    watchTask: true,
                    port: 8888
                }
            }
        }
    });

    // register tasks for the command line
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', ['clean', 'compass', 'uglify']);
    grunt.registerTask('lint', ['sasslint', 'eslint', 'htmlhint']);
};
