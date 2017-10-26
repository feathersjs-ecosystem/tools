# @feathersjs/tools

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/tools.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/tools.png?branch=master)](https://travis-ci.org/feathersjs/tools)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dcdc3acce49350a829d4/test_coverage)](https://codeclimate.com/github/feathersjs/tools/test_coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/tools.svg?style=flat-square)](https://david-dm.org/feathersjs/tools)
[![Download Status](https://img.shields.io/npm/dm/@feathersjs/tools.svg?style=flat-square)](https://www.npmjs.com/package/@feathersjs/tools)

> Codemods and other generator and repository  management tools

## Installation

```
npm install @feathersjs/tools --save
```

## Documentation

Please refer to the [@feathersjs/tools documentation](http://docs.feathersjs.com/) for more details.

## Complete Example

Here's an example of a Feathers server that uses `@feathersjs/tools`. 

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('@feathersjs/tools');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
