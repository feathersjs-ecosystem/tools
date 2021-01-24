const path = require('path');
const npm = require('npm');
const fs = require('fs-extra');
const Runner = require('jscodeshift/src/Runner.js');

const { updateDependencies } = require('./utils');
const npmLoad = new Promise(resolve => npm.load({ loaded: false }, resolve));

const npmInstall = function (commands) {
  return npmLoad.then(() => new Promise((resolve, reject) => {
    npm.commands.install(commands, (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  }));
};

module.exports = function (folder) {
  const filename = path.join(folder, 'package.json');
  const pkg = require(filename);
  const modspath = [__dirname, '..', 'codemods'];
  const libDirectory = (pkg.directories && pkg.directories.lib)
    ? pkg.directories.lib : 'src/';
  const opts = {
    path: [libDirectory, 'lib/', 'test/'],
    verbose: 0,
    extensions: 'js'
  };
  const { dependencies, devDependencies } = updateDependencies(pkg);

  if ((pkg.dependencies && pkg.dependencies['@feathersjs/feathers']) || (pkg.devDependencies && pkg.devDependencies['@feathersjs/feathers'])) {
    throw new Error('It looks like `@feathersjs/feathers` is already a dependency. I can not run the upgrade again.');
  }

  console.log('Installing new dependencies', dependencies.join(', '));
  console.log('Installing new devDependencies', devDependencies.join(', '));

  return fs.writeFile(filename, JSON.stringify(pkg, null, '  '))
    .then(() => dependencies.length ? npmInstall(dependencies.concat('--save')) : null)
    .then(() => devDependencies.length ? npmInstall(devDependencies.concat('--save-dev')) : null)
    .then(() => {
      const run = mod => Runner.run(mod, opts.path, opts);

      return run(path.join(...modspath, 'remove-hooks.js'))
        .then(() => run(path.join(...modspath, 'map-modulenames.js')))
        .then(() => run(path.join(...modspath, 'expressify.js')))
        .then(() => run(path.join(...modspath, 'remove-filters.js')));
    });
};
