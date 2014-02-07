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
  async.waterfall([
    deployPool.bind(this, lb, webpool1, archive),
    deployPool.bind(this, lb, webpool2, archive),
  ], function(err) {
    console.log(err ? 'ERROR: ' + err : 'DONE!');
  });
}

function deployPool(lb, webpool, archive, callback) {
  async.waterfall([
    changeLBServerState.bind(this, 'disable', lb, webpool),
    deployArchive.bind(this, webpool, archive),
    changeLBServerState.bind(this, 'enable', lb, webpool),
  ], callback);
}

function changeLBServerState(action, lb, webpool, callback) {
  async.eachSeries(webpool, function(server, next) {
    lb.ssh('echo "' + action + ' server http00/' + server.address +'.weareawake.net" | socat stdio /var/lib/haproxy/stats', next);
  }, callback);
}

function deployArchive(webpool, archive, callback) {
  var archiveFilename = path.basename(archive),
    remoteDeployDir = '/srv/weareawake-web',
    remoteArchivePath = path.join(remoteDeployDir, archiveFilename),
    unpackedAppDirectoryName = path.basename(remoteArchivePath, '.tar.gz'),
    remoteAppDir = path.join(remoteDeployDir, unpackedAppDirectoryName);

  async.each(webpool, function(server, done){
    async.waterfall([
      server.scp.bind(server, archive, remoteDeployDir),
      server.ssh.bind(server, 'rm -rf ' + remoteAppDir),
      server.ssh.bind(server, 'tar zxvf ' + remoteArchivePath + ' -C ' + remoteDeployDir),
      server.ssh.bind(server, 'rm ' + remoteArchivePath),
      server.ssh.bind(server, 'cd ' + remoteAppDir + ' && npm install --production'),
      server.ssh.bind(server, 'initctl stop weareawake-web || true'),
      server.ssh.bind(server, 'rm /srv/weareawake-web/current || true'),
      server.ssh.bind(server, 'ln -s ' + remoteAppDir + ' /srv/weareawake-web/current'),
      server.ssh.bind(server, 'initctl start weareawake-web'),
    ], done);
  }, callback);
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
