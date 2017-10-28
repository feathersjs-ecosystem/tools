const path = require('path');
const npm = require('npm-programmatic');
const fs = require('fs-extra');
const debug = require('debug')('@feathersjs/tools/upgrade');

const moduleMappings = exports.moduleMappings = {
  // Core, commons and providers
  'feathers': '@feathersjs/feathers',
  'feathers-commons': '@feathersjs/commons',
  'feathers-errors': '@feathersjs/errors',
  'feathers-errors/handler': '@feathersjs/errors/handler',
  'feathers-socket-commons': '@feathersjs/socket-commons',
  'feathers-socketio': '@feathersjs/socketio',
  'feathers-primus': '@feathersjs/primus',
  'feathers-express': '@feathersjs/express',
  'feathers-rest': '@feathersjs/express/rest',
  'feathers-configuration': '@feathersjs/configuration',
  // Authentication
  'feathers-authentication': '@feathersjs/authentication',
  'feathers-authentication-jwt': '@feathersjs/authentication-jwt',
  'feathers-authentication-local': '@feathersjs/authentication-local',
  'feathers-authentication-oauth1': '@feathersjs/authentication-oauth1',
  'feathers-authentication-oauth2': '@feathersjs/authentication-oauth2',
  // Client repositories
  'feathers/client': '@feathersjs/feathers',
  'feathers-client': '@feathersjs/client',
  'feathers-rest/client': '@feathersjs/rest-client',
  'feathers-socketio/client': '@feathersjs/socketio-client',
  'feathers-primus/client': '@feathersjs/primus-client',
  'feathers-authentication/client': '@feathersjs/authentication-client'
};

exports.updateDependencies = function (folder) {
  const filename = path.join(folder, 'package.json');
  const pkg = require(filename);
  const getDependencies = deps => Object.keys(moduleMappings)
    .map(name => {
      if (deps[name]) {
        const dependency = moduleMappings[name].split('/').slice(0, 2).join('/');

        debug(`Changing dependency ${name} to ${dependency}`);

        delete deps[name];
        return dependency;
      }

      return null;
    }).filter(current => current !== null);

  const cwd = process.cwd();
  const deps = getDependencies(pkg.dependencies || {});
  const devDeps = getDependencies(pkg.devDependencies || {});

  if (pkg.dependencies) {
    delete pkg.dependencies['feathers-hooks'];
  }

  if (pkg.devDependencies) {
    delete pkg.devDependencies['feathers-hooks'];
  }

  debug('Installing new dependencies:', deps.join(', '));
  debug('Installing new devDependencies', devDeps.join(', '));

  return fs.writeFile(filename, JSON.stringify(pkg, null, '  '))
    .then(() => deps.length ? npm.install(deps, {
      cwd, save: true
    }) : null)
    .then(() => devDeps.length ? npm.install(devDeps, {
      cwd, saveDev: true
    }) : null);
};
