const assert = require('assert');
const upgrade = require('../lib/upgrade');
const utils = require('../lib/upgrade/utils');

describe('upgrade', () => {
  it('exports a function', () =>
    assert.equal(typeof upgrade, 'function')
  );

  describe('utils', () => {
    it('exports moduleMappings', () =>
      assert.equal(typeof utils.moduleMappings, 'object')
    );

    it('updateDependencies', () => {
      const pkg = {
        dependencies: {
          feathers: '2.0.0',
          'feathers-hooks': '2.0.0'
        },
        devDependencies: {
          'feathers-socketio': 'test'
        }
      };

      assert.deepEqual(utils.updateDependencies(pkg), {
        pkg,
        dependencies: [ '@feathersjs/feathers' ],
        devDependencies: [ '@feathersjs/socketio' ]
      });
      assert.ok(!pkg.dependencies['feathers-hooks']);
    });
  });
});
