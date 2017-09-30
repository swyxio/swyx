Swyx module
=========

An experimental lightweight sugar module to integrate the NERDS (Node, Express, ReDux, and SQL) stack.

## Installation

  `npm install swyx`

## Usage

    var client = require('swyx').client; // not yet implemented

    var server = require('swyx').server;
    var app = server.app;
    app.use('/', (req, res) => res.send('Hello World'))
    app.finalHandler() // optional error handling
  
  
  foobar


## Tests (not maintained yet as this is still in alpha testing)

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## References

- <https://medium.com/@jdaudier/how-to-create-and-publish-your-first-node-js-module-444e7585b738>
- <http://wiki.commonjs.org/wiki/Modules/1.1>
- useful tips <http://fredkschott.com/post/2013/12/node-js-cookbook---designing-singletons/> and [with Symbol](https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/) or maybe [not doing it ](https://medium.com/@iaincollins/how-not-to-create-a-singleton-in-node-js-bd7fde5361f5)

## NPM Package notes

`release-it`