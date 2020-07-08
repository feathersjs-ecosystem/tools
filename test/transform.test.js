const { strict: assert } = require('assert');
const { ts, transform } = require('../lib');

describe('transforms', () => {
  it('findConfigure', () => {
    const code = `
      const feathers = require('feathers');

      const app = feathers();

      app.configure(thing);
      app.configure(authentication);
    `;

    const result = transform(code).findConfigure('authentication').insertBefore('app.configure(muhkuh);').toSource();

    assert.equal(result, `
      const feathers = require('feathers');

      const app = feathers();

      app.configure(thing);
      app.configure(muhkuh);
      app.configure(authentication);
    `);
  });

  it('findDeclaration', () => {
    const code = `
      const a = "test";
      const b = "hi";
    `;
    const result = transform(code).findDeclaration('b').insertBefore('const x = 2;').toSource();

    assert.equal(result, `
      const a = "test";
      const x = 2;
      const b = "hi";
    `);
  });

  it('findDeclaration TypeScript', () => {
    const code = `
      const a: string = "test";
      const b: string = "hi";
    `;
    const result = transform(code, {
      parser: ts
    }).findDeclaration('b').insertBefore('const x = 2;').toSource();

    assert.equal(result, `
      const a: string = "test";
      const x = 2;
      const b: string = "hi";
    `);
  });

  it('insertHook', () => {
    const code = `
      module.exports = {
        before: {
          all: [],
          create: []
        }
      }
    `;
    const result = transform(code).insertHook('before', 'create', 'testing').toSource();

    assert.equal(result, `
      module.exports = {
        before: {
          all: [],
          create: [testing()]
        }
      }
    `);
  });

  it('insertLastInFunction', () => {
    const code = `
      module.exports = function () {
        const app = this;
      };
    `;

    const result = transform(code).insertLastInFunction('app.use(\'/test\', middleware);').toSource();

    assert.equal(result, `
      module.exports = function () {
        const app = this;
        app.use('/test', middleware);
      };
    `);
  });
});
