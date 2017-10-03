const chalk = require('chalk')
const debug = require('debug')('swyx:server') // run node/nodemon with `DEBUG=*` prefix to see all debug logs
const express = require('express')
const path = require('path')

var server = function (middlewareParams = {}, listenParams = {}) {
  // everything instantiated, now parse through options
  const {
    userApp,    // supply an express instance if you want, will set one up for you if you don't have one
    bodyParser, // supply `bodyParser: null` to turn off the default json and urlencoded config
    morgan,     // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
    staticRouting, // supply `staticRouting: null` to turn off. defaults to `/public`.
  } = middlewareParams

  const {
    htmlSPA, // catchall to render single page apps. supply `htmlSPA: null` to turn off. defaults to `/public/index.html`.
    socketCallback // off by default. supply a callback fn `io => socket => {socket.on('event', ()=>console.log('event'))}` to turn on
  } = listenParams

  // accepts modules that you give it if you want to take over
  // if not it supplies its own
  app = userApp || express()

  // supply `bodyParser: null` to turn off the default code below
  if (bodyParser !== null) {
    const bp = require('body-parser')
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
  }

  // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
  if (morgan !== null) {
    const Morgan = require('morgan');
    switch (typeof morgan) {
      case 'string':
        app.use(Morgan(morgan));
        break;
      case 'object':
        app.use(morgan)
        break;
      default:
        app.use(Morgan('dev'))
    }
  }
  
  // supply `staticRouting: null` to turn off. defaults to `/public`.
  if (staticRouting !== null) {
    const staticRoutingPath = staticRouting || '/public'
    app.use(express.static(path.join(process.env.PWD, staticRoutingPath)))
  }

  // const passport = require('passport')
  // const session = require('express-session');
  // const db = require('../db');
  // const cors = require('cors');
  
  // // take stuff from .env file in development, from process.env in production
  // if (process.env.NODE_ENV === 'development') {
  //   require('dotenv').config();
  // }

  // ************************************
  // here we export the public facing API
  // ************************************

  this.app = app;
  this.listen = () => {
    if (htmlSPA !== null) {
      const htmlSPApath = htmlSPA || '/public/index.html'
      app.use('*', (req, res) => {
        res.sendFile(path.join(process.env.PWD, htmlSPApath))
      })
    }
    const appserver = app.listen(
      process.env.PORT || 3000,
      () => {
        console.log(`--- Started HTTP Server for package:swyx ---`)
        const { address, port } = appserver.address()
        const host = address === '::' ? 'localhost' : address
        const urlSafeHost = host.includes(':') ? `[${host}]` : host
        console.log(`Listening on http://${urlSafeHost}:${port}`)
      }
    )
    // supply a callback fn `io => socket => {socket.on('event', ()=>console.log('event'))}` to turn on
    if (typeof socketCallback === 'function') {
      const socketio = require('socket.io')
      const io = socketio(appserver)
      io.on('connection', socketCallback(io))
    }
    return appserver
  }
  this.finalHandler = (err, req, res, next) => {
      // Error middleware interceptor, delegates to same handler Express uses.
      // https://github.com/expressjs/express/blob/master/lib/application.js#L162
      // https://github.com/pillarjs/finalhandler/blob/master/index.js#L172

      const PrettyError = require('pretty-error')
      const finalHandler = require('finalhandler')
      // PrettyError docs: https://www.npmjs.com/package/pretty-error

      // Pretty error prints errors all pretty.
      const prettyError = new PrettyError
      // Skip events.js and http.js and similar core node files.
      prettyError.skipNodeFiles()
      // Skip all the trace lines about express' core and sub-modules.
      prettyError.skipPackage('express')
      debug('---finalHandler triggered---')
      console.error(prettyError.render(err)) // could also print err.stack
      finalHandler(req, res)(err)
  }

  return this;

}

module.exports = server

// Start listening only if we're the main module.
// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
if (module === require.main) server.listen()
