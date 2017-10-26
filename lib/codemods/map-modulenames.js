const { moduleMappings } = require('../upgrade/utils');
const debug = require('debug')('@feathersjs/tools/codemods/map-modulename');

// Replaces all `require('something')` with the appropriate
// new module mapping
module.exports = function transformer (file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source);

  debug(`Running require transformation on ${file.path}`);

  ast.find(j.Literal).filter(node => {
    const parent = node.parent.value;

    return parent.type === 'CallExpression' &&
      parent.callee.name === 'require';
  }).forEach(node => {
    const name = node.value.value;
    const mapped = moduleMappings[name];

    if (mapped) {
      debug(`Mapping ${name} to ${mapped}`);

      node.value.value = mapped;
    }
  });

  return ast.toSource({ quote: 'single' });
};
