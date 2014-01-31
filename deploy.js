#!/usr/local/bin/node

var path = require('path'),
  fs = require('fs'),
  control = require('control'),
  async = require('async'),
  environments = {
    prod: {
      loadbalancer: { lb01: { user: 'root' }},
      webpool1: { web01: { user: 'root' }},
      webpool2: { web02: { user: 'root' }}
    }
  };

function deploy(lb, webpool1, webpool2, archive) {
  async.series([
    // deploy pool1
    function(next) { changeLBServerState('disable', lb, webpool1, next); },
    function(next) { deployPool(webpool1, archive, next); },
    function(next) { changeLBServerState('enable', lb, webpool1, next); },
    // deploy pool2
    function(next) { changeLBServerState('disable', lb, webpool2, next); },
    function(next) { deployPool(webpool2, archive, next); },
    function(next) { changeLBServerState('enable', lb, webpool2, next); },
  ], function(err) {
    console.log(err ? 'ERROR: ' + err : 'DONE!');
  });
}

function changeLBServerState(action, lb, webpool, next) {
  async.eachSeries(webpool, function(server, nextServer) {
    lb.ssh('echo "' + action + ' server http00/' + server.address +'.weareawake.net" | socat stdio /var/lib/haproxy/stats', nextServer);
  }, next);
}

function deployPool(webpool, archive, next) {
  async.each(webpool, function(server, nextServer){
    var archiveFilename = path.basename(archive),
      remoteDeployDir = '/srv/weareawake-web',
      remoteArchivePath = path.join(remoteDeployDir, archiveFilename),
      unpackedAppDirectoryName = path.basename(remoteArchivePath, '.tar.gz'),
      remoteAppDir = path.join(remoteDeployDir, unpackedAppDirectoryName),
      sshTasks = [
        'tar zxvf ' + remoteArchivePath + ' -C ' + remoteDeployDir,
        'rm ' + remoteArchivePath,
        'cd ' + remoteAppDir + ' && npm install --production',
        'initctl stop weareawake-web || true',
        'rm /srv/weareawake-web/current || true',
        'ln -s ' + remoteAppDir + ' /srv/weareawake-web/current',
        'initctl start weareawake-web'
      ];

    server.scp(archive, remoteDeployDir, function nextSsh() {
      server.ssh(sshTasks.shift(), sshTasks.length ? nextSsh : nextServer);
    });
  }, function() {
    next();
  });
}

(function(env, archive) {
  if (env !== 'prod') {
    console.error('please specify a valid environment [prod]');
    return;
  }

  if (!fs.existsSync(archive)) {
    console.error('please specify a valid archive to deploy');
    return;
  }

  var lb = control.controllers(environments[env].loadbalancer)[0],
    webpool1 = control.controllers(environments[env].webpool1),
    webpool2 = control.controllers(environments[env].webpool2);

  deploy(lb, webpool1, webpool2, archive);
}).apply(this, process.argv.splice(2));
