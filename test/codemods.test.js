'use strict';

const jscodeshift = require('@feathersjs/jscodeshift');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function runTest (name) {
  const base = path.join(root, 'fixtures', name);
  const fileName = path.join(base, 'input.js');
  const transform = require(path.join(root, 'lib', 'codemods', name));
  const read = fileName => fs.readFileSync(fileName, 'utf8');

  const source = read(fileName);
  const output = read(path.join(base, 'output.js'));
  const transformed = transform({
    path: fileName, source
  }, { jscodeshift }, {}) || '';

  it(name, () => assert.equal(transformed.trim(), output.trim()));
}

describe('codemods', () => {
  runTest('export-to-cjs');
  runTest('expressify');
  runTest('import-to-require');
  runTest('map-modulenames');
  runTest('remove-filters');
  runTest('remove-hooks');
});
