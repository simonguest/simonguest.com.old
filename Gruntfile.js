module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        notify: {
            preview: {
                options: {
                    message: 'Blog now running in preview mode!'
                }
            }
        },
        shell: {
            preview: {
                command: 'wintersmith preview'
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['npm-install','notify:preview', 'shell:preview']);
};