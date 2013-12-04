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

  controller.scp(archivePath, remoteDeployDir, function() {
    controller.ssh('tar zxvf ' + remoteArchivePath + ' -C ' + remoteDeployDir, function () {
      controller.ssh('cd ' + remoteAppDir + ' && npm install --production', function() {
        controller.ssh('killall node || true', function() {
          controller.ssh('rm /root/weareawake-current || true && ln -s ' + remoteAppDir + ' /root/weareawake-current', function() {
            controller.ssh('node /root/weareawake-current/app.js');
          });
        });
      });
    });
  });
});

control.begin();
