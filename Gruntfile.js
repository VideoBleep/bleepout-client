/*
 * bleepout-client gruntfile 12/14/14 jessica.marcus@gmail.com
 *
 * uglifies and concatenates all required css/js files, and then writes them inline in the index.html file.
 *
 * run "npm install" to install all dependencies; if you have not used Grunt before, you'll need to install it:
 *
 * > "npm install -g grunt-cli"
 *
 * run "grunt build" to produce production-ready optimized index.html file => dist/
 * run "grunt minfiles" to process all files without inlining to index.html => .tmp/
 *
 */
module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            pre: ['dist/'],
            post: ['.tmp/']
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: 'index.html',
                dest: '.tmp/',
                filter: 'isFile'
            }
        },
        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: '.tmp/'
            }
        },
        usemin: {
            html: ['.tmp/index.html']
        },
        inline: {
            dist: {
                options: {
                    tag: 'min_'
                },
                src: ['.tmp/index.html'],
                dest: ['dist/']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('minfiles', ['useminPrepare', 'copy', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin']);
    grunt.registerTask('build', ['clean:pre', 'minfiles', 'usemin', 'inline', 'clean:post']);
};