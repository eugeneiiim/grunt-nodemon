/*
 * grunt-nodemon
 * https://github.com/ChrisWren/grunt-nodemon
 *
 * Copyright (c) 2013 Chris Wren
 * Licensed under the MIT license.
 */

var path = require('path');

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('nodemon', 'Starts a nodemon server.', function () {

    var command = ['node_modules/nodemon/nodemon'];
    var options = this.options();
    var done = this.async();
    var nodemonignoreMessage = '# Generated by grunt-nodemon';

    if (options.exec) {
      command.push('--exec');
      command.push(options.exec);
    }

    if (options.delayTime) {
      command.push('--delay')
      command.push(options.delayTime);
    }

    if (options.ignoredFiles) {
      var fileContent = nodemonignoreMessage + '\n';
      options.ignoredFiles.forEach(function (ignoredGlob) {
        fileContent += ignoredGlob + '\n';
      });
      grunt.file.write('.nodemonignore', fileContent);
    }
    else if (grunt.file.exists('.nodemonignore') && grunt.file.read('.nodemonignore').indexOf(nodemonignoreMessage) === 0){
      grunt.file.delete('.nodemonignore');
    }

    if (options.watchedFolders) {
      options.watchedFolders.forEach(function (folder) {
        command.push('--watch');
        command.push(folder);
      });
    }

    if (options.watchedExtensions) {
      command.push('-e');
      var extensionList = '';
      options.watchedExtensions.forEach(function (extensions) {
        extensionList += extensions + ','
      });
      command.push(extensionList.slice(0, -1));
    }

    if (options.debug) command.push('--debug');

    if (options.cwd) {
      options.cwd.split(path.sep).forEach(function () {
        command[0] = '../' + command[0];
      });
      options.file = options.file.substr(options.cwd.length + 1);
      process.chdir(options.cwd);
    }

    if (options.file) command.push(options.file);

    if (options.args) {
      options.args.forEach(function (arg) {
        command.push(arg);
      });
    }

    grunt.util.spawn({
      cmd: 'node',
      args: command,
      opts: {
        stdio: 'inherit'
      }
    },
    function (error, result) {
      if (error) {
        grunt.log.error(result.stderr);
        done(false);
      }
      grunt.log.writeln(result.stdout);
      done();
    });
  });

}
