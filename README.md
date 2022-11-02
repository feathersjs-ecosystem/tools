# @feathersjs/tools

> __Note:__ `@feathersjs/tools` is no longer used. See https://github.com/feathersjs/feathers for the Feathers CLI.

[![Node.js CI](https://github.com/feathersjs/tools/workflows/Node.js%20CI/badge.svg)](https://github.com/feathersjs/tools/actions?query=workflow%3A%22Node.js+CI%22)
[![Dependency Status](https://img.shields.io/david/feathersjs/tools.svg?style=flat-square)](https://david-dm.org/feathersjs/tools)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs/tools.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs/tools)

> Codemods and other generator and repository  management tools

## Installation

```
npm install @feathersjs/tools --save
```

## Local exports

- `upgrade` contains the functionality to update a current Feathers application or plugin to version 3 (including rewriting all module `require`s to use the `@feathersjs` namespace)
- `transform` contains [JSCodeshift](https://github.com/facebook/jscodeshift/) utilities used mainly by the generator.

## Global tools

When `@feathersjs/tools` is installed globally, `convert-repository` is an internal tool that updates the old Feathers plugin infrastructure that is using Babel to the new one without (see https://github.com/feathersjs/feathers/issues/608 for why and how).

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
