var _    = require('underscore'),
    path = require('path');

module.exports = function(grunt) {

  'use strict';

  grunt.registerTask('autodeploy', 'Gets rackspace servers by key', function() {

    var done = this.async();

    grunt.config.requires(
      'autodeploy.servers.provider',
      'autodeploy.servers.username',
      'autodeploy.servers.apiKey',
      'autodeploy.servers.region',
      'autodeploy.servers.serverKey',
      'autodeploy.dest',
      'pkg.version',
      'pkg.name'
    );

    var rackspace = require('pkgcloud').compute.createClient({

      provider: grunt.config.get('autodeploy.servers.provider'),
      username: grunt.config.get('autodeploy.servers.username'),
      apiKey: grunt.config.get('autodeploy.servers.apiKey'),
      region: grunt.config.get('autodeploy.servers.region')

    });

    rackspace.getServers(function(err, servers) {

      var set = getServerType(grunt.config.get('autodeploy.servers.serverKey'), servers);

      done(setConfig(set));

    });

  });

  function getServerType(key, servers) {

    return servers.filter(function(server) {
      return server.name.indexOf(key) != -1;
    });

  };

  function setConfig(servers) {

    var i,
        host,
        dest,
        rsyncTask,
        target = grunt.option('target') || 'staging',
        serverUser = grunt.config.get('autodeploy.servers.serverUser'),
        appName = grunt.config.get('pkg.name'),
        commands = grunt.config.get('autodeploy.commands');

    for (i = 0; i < servers.length; i++) {

      host = _.findWhere(servers[i].addresses.public, {version: 4}).addr;
      dest = path.join(grunt.config.get('autodeploy.dest'), appName, grunt.config.get('pkg.version'));

      if (serverUser) {
        host = serverUser + '@' + host;
      }

      rsyncTask = {
        options: {
          dest: dest,
          host: host
        }
      };

      if (commands) {
        for (var key in commands) {
          commands[key] = 'ssh ' + host + ' ' + commands[key];
        }
      }

      grunt.log.debug('Destination ' + i + ': ' + rsyncTask.options.dest);
      grunt.log.debug('Host ' + i + ': ' + rsyncTask.options.host);

      grunt.log.debug('rsync config: rsync.' + target + i);

      grunt.log.debug('-----------');

      grunt.config.set('rsync.' + target + i, rsyncTask);
      grunt.config.set('exec.' + target + i, commands);

    }

  }

};