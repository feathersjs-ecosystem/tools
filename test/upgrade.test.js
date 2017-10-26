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
  });
});
