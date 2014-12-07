module.exports = function (grunt) {
    grunt.initConfig({
        //clean: {
        //    pre: ['dist/'],
        //    post: ['.tmp/']
        //},
        //copy: {
        //    main: {
        //        expand: true,
        //        cwd: 'src',
        //        src: 'index.html',
        //        dest: 'dist/',
        //        filter: 'isFile'
        //    }
        //},
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
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline');

    //grunt.registerTask('build', ['clean:pre', 'copy', 'clean:post']);
    grunt.registerTask('build', ['inline']);
};