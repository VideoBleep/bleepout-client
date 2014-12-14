module.exports = function (grunt) {
    grunt.initConfig({
        //clean: {
        //    pre: ['dist/'],
        //    post: ['.tmp/']
        //},
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: 'index.html',
                dest: 'dist/',
                filter: 'isFile'
            }
        },
        useminPrepare: {
            html: 'src/index.html',
            options: {
                //dest: 'dist/'
            }
        },
        usemin: {
            html: ['dist/index.html'],
            options: {
                //assetDirs: '.tmp/'
            }
        },
        inline: {
            dist: {
                options: {
                    tag: '',
                    cssmin: true,
                    uglify: true
                },
                src: ['src/index.html'],
                dest: ['dist/']
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //grunt.registerTask('build', ['clean:pre', 'copy', 'clean:post']);
    grunt.registerTask('build', ['inline']);
    grunt.registerTask('min', ['useminPrepare', 'copy', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin']);
};