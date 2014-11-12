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
    mkdir: {
      build: {
        options:{
          create:['build']
        }
      }
    },
    clean: {
      build:['build']
    },
    shell: {
      preview: {
        command: 'wintersmith preview'
      },
      build: {
        command: 'wintersmith build'
      },
      git_clone:{
        command: 'git clone https://github.com/simonguest/simonguest.github.io .',
        options: {
          execOptions: {
            cwd: 'build'
          }
        }
      },
      git_add: {
        command: 'git add -A',
        options: {
          execOptions: {
            cwd: 'build'
          }
        }
      },
      git_commit: {
        command: 'git commit -m "Updated Pages on <%=new Date().toString()%>"',
        options: {
          execOptions: {
            cwd: 'build'
          }
        }
      },
      git_push: {
        command: 'git push',
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
  grunt.registerTask('build-folder', ['clean:build', 'mkdir:build', 'shell:git_clone']);
  grunt.registerTask('build', ['shell:build', 'copy:cname']);
  grunt.registerTask('commit', ['shell:git_add', 'shell:git_commit', 'shell:git_push']);
  grunt.registerTask('deploy', ['build-folder', 'build', 'commit']);
};