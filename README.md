Swyx module
=========

An experimental lightweight sugar module to integrate the NERDS (Node, Express, ReDux, and SQL) stack.

## Installation

  `npm install swyx`

## Usage

    const socketCallback = socket => {
      console.log(`A socket connection to the server has been made: ${socket.id}`)
      socket.on('disconnect', () => {
        console.log(`Connection ${socket.id} has left the building`)
      })
    }
    const middlewareOptions = {
      // userApp,    // supply an express instance if you want, will set one up for you if you don't have one
      // bodyParser, // supply `bodyParser: null` to turn off the default json and urlencoded config
      // morgan,     // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
      // staticRouting, // supply `staticRouting: null` to turn off. defaults to `/public`.
    }
    const listenOptions = {
      // htmlSPA, // catchall to render single page apps. supply `htmlSPA: null` to turn off. defaults to `/public/index.html`.
      socketCallback // off by default. supply a callback fn `socket => {socket.on('event', ()=>console.log('event'))}` to turn on
    }
    const server = require('swyx').server(middlewareOptions, listenOptions);
    const app = server.app;
    app.get('/api', (req, res) => res.send('this is api route'))
    app.use(server.finalHandler) // optional error handling
    server.listen()
  
  
  some more words.


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