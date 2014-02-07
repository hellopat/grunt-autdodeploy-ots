module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    'autodeploy': {
      servers: {
        provider: 'your-provider',
        username: 'your-username',
        apiKey: 'your-api-key',
        region: 'your-server-region',
        serverKey: 'server-group',
        serverUser: 'server-username'
      },
      dest: '/path/to/application',
      commands: {
        stop: 'stop <%= pkg.name %>',
        start: 'start <%= pkg.name %>',
        restart: 'restart <%= pkg.name %>',
        replaceSymlink: 'ln -s <%= autodeploy.dest %> /var/www/<%= pkg.name %>',
        npmUpdate: 'cd <%= autodeploy.dest %>; npm update --' + grunt.option('target') + ';'
      }
    }

  });

  grunt.loadTasks('./tasks');

};