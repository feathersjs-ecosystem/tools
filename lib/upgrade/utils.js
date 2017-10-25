const path = require('path');
const npm = require('npm-programmatic');
const fs = require('fs-extra');

const moduleMappings = exports.moduleMappings = {
  // Core, commons and providers
  'feathers': '@feathersjs/feathers',
  'feathers-commons': '@feathersjs/commons',
  'feathers-errors': '@feathersjs/errors',
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

        console.log(`Changing dependency ${name} to ${dependency}`);

        delete deps[name];
        return dependency;
      }

      return null;
    }).filter(current => current !== null);

  const cwd = process.cwd();
  const deps = getDependencies(pkg.dependencies || {});
  const devDeps = getDependencies(pkg.devDependencies || {});

  delete deps['feathers-hooks'];
  delete devDeps['feathers-hooks'];

  console.log('Installing new dependencies', deps);
  console.log('Installing new devDependencies', devDeps);

  return fs.writeFile(filename, JSON.stringify(pkg, null, '  '))
    .then(() => deps.length ? npm.install(deps, {
      cwd, save: true
    }) : null)
    .then(() => devDeps.length ? npm.install(devDeps, {
      cwd, saveDev: true
    }) : null);
};
