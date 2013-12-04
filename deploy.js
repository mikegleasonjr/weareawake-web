#!/usr/local/bin/node

var control = require('control'),
  task = control.task,
  path = require('path');

task('prod', 'Defines production environment', function () {
  var config = {
    'webserver01': { user: 'root' }
  };

  return control.controllers(config);
});

task('web', 'Deploys website', function (controller, archivePath) {
  if (!archivePath) {
    console.log(' please specify the archive to deploy...');
    return;
  }

  var archiveFilename = path.basename(archivePath),
    remoteDeployDir = '/root',
    remoteArchivePath = path.join(remoteDeployDir, archiveFilename),
    unpackedAppDirectoryName = path.basename(remoteArchivePath, '.tar.gz')
    remoteAppDir = path.join(remoteDeployDir, unpackedAppDirectoryName);

  var sshTasks = [
    'tar zxvf ' + remoteArchivePath + ' -C ' + remoteDeployDir,
    'rm ' + remoteArchivePath,
    'cd ' + remoteAppDir + ' && npm install --production',
    'cd ' + remoteAppDir + ' && ./node_modules/forever/bin/forever stopall || true',
    'rm /root/weareawake-current || true && ln -s ' + remoteAppDir + ' /root/weareawake-current',
    "sh -c 'nohup /root/weareawake-current/node_modules/forever/bin/forever /root/weareawake-current/app.js > /dev/null 2>&1 &'"
  ];

  controller.scp(archivePath, remoteDeployDir, function() {
    (function doNextSshTask() {
      if (sshTasks.length) {
        controller.ssh(sshTasks.shift(), doNextSshTask)
      }
    })();
  });
});

control.begin();
