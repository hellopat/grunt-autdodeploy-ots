module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    autodeploy: {
      servers: {
        provider: 'your-provider',
        username: 'your-username',
        apiKey: 'your-api-key',
        region: 'your-server-region',
        serverKey: 'server-group'
      },
      dest: '/path/to/application'
    }

  });

  grunt.loadTasks('./tasks');

};