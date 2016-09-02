module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            css: {
                files: ['**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['uglify']
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'dist/assets/js/ui-bootstrap-tpls.min.js': ['node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'],
                }
            },
            src: {
                files: [{expand: true, cwd: 'src/js', src: '**/*.js', dest: 'dist/modules', ext: '.min.js'}]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{expand: true, cwd: 'src/sass', src: '**/*.scss', dest: 'dist/assets/css', ext: '.min.css'}]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            'node_modules/angular/angular.min.js',
                            'node_modules/angular-route/angular-route.min.js',
                            'node_modules/angular-sanitize/angular-sanitize.min.js',
                            'node_modules/angular-touch/angular-touch.min.js',
                            'node_modules/angular-animate/angular-animate.min.js',
                            'node_modules/angular-ui-grid/ui-grid.min.js',
                            'node_modules/angular-chart.js/dist/angular-chart.min.js',
                            'node_modules/angular-chart.js/node_modules/chart.js/dist/Chart.min.js',
                            'node_modules/angularjs-slider/dist/rzslider.min.js'
                        ],
                        dest: 'dist/assets/js/',
                        flatten: true
                    },
                    {
                        expand: true,
                        src: [
                            'node_modules/angular-ui-grid/ui-grid.eot',
                            'node_modules/angular-ui-grid/ui-grid.min.css',
                            'node_modules/angular-ui-grid/ui-grid.svg',
                            'node_modules/angular-ui-grid/ui-grid.ttf',
                            'node_modules/angular-ui-grid/ui-grid.woff'
                        ],
                        dest: 'dist/assets/css/',
                        flatten: true
                    },
                    {
                        expand: true, cwd: 'node_modules/font-awesome/fonts/', src: '**', dest: 'dist/assets/fonts/'
                    },
                ],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask('default', ['sass', 'copy', 'watch']);
    grunt.registerTask('actualizar', ['sass', 'copy', 'uglify']);
};