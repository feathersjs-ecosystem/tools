// Replaces all `export function x() {}` and `export const x`
// With the equivalent `exports.x =`
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source);
  
  ast.find(j.ExportDefaultDeclaration)
    .forEach(path => {
      const exports = j.memberExpression(
        j.identifier('module'), j.identifier('exports')
      );
      const expr = j.expressionStatement(
        j.assignmentExpression('=', exports, path.value.declaration)
      );

      j(path).replaceWith(expr);
    });
  
  ast.find(j.ExportNamedDeclaration)
    .forEach(path => {
      const { value } = path;
    
      if(value.declaration && value.declaration.id) {
        const name = value.declaration.id.name;
        const fn = j.functionExpression(
          j.identifier(name),
          value.declaration.params,
          value.declaration.body
        );
        const exports = j.memberExpression(
          j.identifier('exports'), j.identifier(name)
        );
        const expr = j.expressionStatement(
          j.assignmentExpression('=', exports, fn)
        );
        
        j(path).replaceWith(expr);
      } else if(value.declaration.declarations) {
        const dec = value.declaration.declarations[0];
        const name = dec.id.name;
        const me = j.memberExpression(j.identifier('exports'), j.identifier(name));
        
        const expr = j.expressionStatement(
          j.assignmentExpression('=', me, dec.init)
        );
        
        j(path).replaceWith(expr);
      }
    });
  
  return ast.toSource();
}
