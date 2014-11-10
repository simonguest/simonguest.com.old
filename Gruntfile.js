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
      },
      build: {
        command: 'wintersmith build'
      },
      deploy: {
        command: ['git add -A','git commit -m "Updated Pages"','git push'].join('&&'),
        options: {
          execOptions: {
            cwd: 'build'
          }
        }
      }
    },
    copy: {
      cname: {
        src: 'CNAME',
        dest: 'build/CNAME'
      }
    }
  });

  grunt.registerTask('default', ['npm-install', 'notify:preview', 'shell:preview']);
  grunt.registerTask('deploy', ['shell:build', 'copy:cname', 'shell:deploy']);
};