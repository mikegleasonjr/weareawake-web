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
    remoteDeployDir = '/srv/weareawake-web',
    remoteArchivePath = path.join(remoteDeployDir, archiveFilename),
    unpackedAppDirectoryName = path.basename(remoteArchivePath, '.tar.gz')
    remoteAppDir = path.join(remoteDeployDir, unpackedAppDirectoryName);

  var sshTasks = [
    'tar zxvf ' + remoteArchivePath + ' -C ' + remoteDeployDir,
    'rm ' + remoteArchivePath,
    'cd ' + remoteAppDir + ' && npm install --production',
    '/sbin/stop weareawake-web || true',
    'rm /srv/weareawake-web/current || true',
    'ln -s ' + remoteAppDir + ' /srv/weareawake-web/current',
    '/sbin/start weareawake-web'
  ];

  controller.scp(archivePath, remoteDeployDir, function next() {
    if (sshTasks.length) {
      controller.ssh(sshTasks.shift(), next);
    }
  });
});

control.begin();
