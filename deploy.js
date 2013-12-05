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
    console.error('please specify the archive to deploy from archives/');
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
    'cd /root/weareawake-current && ./node_modules/forever/bin/forever start /root/weareawake-current/app.js --sourceDir /root/weareawake-current'
  ];

  controller.scp(archivePath, remoteDeployDir, function next() {
    if (sshTasks.length) {
      controller.ssh(sshTasks.shift(), next);
    }
  });
});

control.begin();
