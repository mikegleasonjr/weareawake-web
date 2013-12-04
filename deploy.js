var control = require('control'),
  task = control.task,
  path = require('path');

task('prod', 'Config for web', function () {
  var config = {
    'x.x.x.x': {
      user: 'root'
    }
  };

  return control.controllers(config);
});

task('website', 'Deploys website', function (controller, archive) {
  if (!archive) {
    throw 'please specify the archive to deploy';
  }

  var basename = path.basename(archive),
    remoteDir = '/tmp',
    remotePath = path.join(remoteDir, basename),
    remoteAppDir = path.join(remoteDir, 'myapp');

  controller.scp(archive, remoteDir, function() {
    controller.ssh('tar xvf ' + remotePath + ' -C ' + remoteAppDir, function () {
      //controller.ssh("sh -c 'cd " + remoteAppDir + " && node myapp.js'");
    });
  });
});

control.begin();
