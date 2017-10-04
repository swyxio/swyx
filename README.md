Swyx module
=========

An experimental sugar module to integrate the NERDS (Node, Express, ReDux, and SQL) stack for rapidly setting up fullstack JS Single Page Apps.

There was a big breaking change from 0.1.17 onward, please note the API change if you used it from before

```javascript
const app = require('swyx')().app
app.get('/hello', (req, res) => res.send('Hello World'))
app.start() // visit http://localhost:3000/hello to see 'Hello World'
```

In this 3-line Hello World example, here is the included functionality configured by default:
- `body-parser`
- `morgan`
- `express.static` to the `/public` folder
- `app.use('*', ...)` catchall route to serve `/public/index.html` for SPAs
- uses port 3000 by default unless you specify the `PORT` env variable (e.g. `PORT=1337 node index.js`)

Simply pass a callback function `io => socket => {...}` to `app.start` to set up `socket.io` on the backend.

## Installation

  `npm install swyx`

## Example Usage with sockets (and annotated options)

`index.js` for the server:

```javascript
const server = require('swyx')({
  // userApp,    // supply an express instance if you want, will set one up for you if you don't have one
  // bodyParser, // supply `bodyParser: null` to turn off the default json and urlencoded config
  // morgan,     // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
  // staticRouting, // supply `staticRouting: null` to turn off. defaults to `/public`.
})
const app = server.app
app.get('/api', (req, res) => res.send('this is api route'))
app.use(server.finalHandler) // optional error handling
const socketCallback = io => socket => {
  console.log(`A socket connection to the server has been made: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })
  socket.on('client', val => {
    console.log('client received', val);
    socket.broadcast.emit('server', val) // or `io.sockets.emit('server', val)` to send to all including sender
  })
}
server.start({
  // htmlSPA, // catchall to render single page apps. supply `htmlSPA: null` to turn off. defaults to `/public/index.html`.
  socketCallback // off by default. supply a callback fn `io => socket => {socket.on('event', ()=>console.log('event'))}` to turn on
})
```

`socket.io` is implemented for you on the server side, but is up to you to implement on client side. Sample socket connection on the client:

```javascript
import io from 'socket.io-client'

const socket = io(window.location.origin)
socket.on('connect', () => {
  console.log('Socket Connected!')
  socket.on('server', val => console.log('server', val))
})
```

  Documentation to be completed


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