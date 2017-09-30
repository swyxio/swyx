const chalk = require('chalk')
const debug = require('debug')('swyx:server')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
// PrettyError docs: https://www.npmjs.com/package/pretty-error
const Morgan = require('morgan');

// Pretty error prints errors all pretty.
const prettyError = new PrettyError
// Skip events.js and http.js and similar core node files.
prettyError.skipNodeFiles()
// Skip all the trace lines about express' core and sub-modules.
prettyError.skipPackage('express')

var server = (function (params, options = {}) {
  // accepts modules that you give it if you want to take over
  let { app } = params || {}
  // if not it supplies its own
  app = app || require('express')()


  // everything instantiated, now parse through options
  const { 
    bodyParser, // supply `bodyParser: false` to turn off the default code below
    morgan,     // defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
    finalhandler // supply `finalhandler: false` to turn off the error handling with finalhandler
  } = options

  // supply `bodyParser: false` to turn off the default code below
  if (!bodyParser) {
    const bp = require('body-parser')
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
  }

  // defaults to `Morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
  if (!morgan) app.use(Morgan('dev'))
  else typeof morgan === 'string' ? app.use(Morgan(morgan)) : app.use(morgan)


  // supply `finalhandler: false` to turn off the error handling for 500
  if (!finalhandler) {
    // Error middleware interceptor, delegates to same handler Express uses.
    // https://github.com/expressjs/express/blob/master/lib/application.js#L162
    // https://github.com/pillarjs/finalhandler/blob/master/index.js#L172
    app.use((err, req, res, next) => {
      console.error(prettyError.render(err))
      finalHandler(req, res)(err)
    })
  }
  
  // const passport = require('passport')
  // const session = require('express-session');
  // const db = require('../db');
  // const morgan = require('morgan');
  // const cors = require('cors');
  
  // // take stuff from .env file in development, from process.env in production
  // if (process.env.NODE_ENV === 'development') {
  //   require('dotenv').config();
  // }
  // const cors = require('cors');
  // app.use(cors());
  // app.options('*', cors());


  // here we export `app` and `listen` as the public facing API
  this.app = app;
  this.listen = () => {
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
    return appserver
  }

  return this;

})();

module.exports = server

// Start listening only if we're the main module.
// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
if (module === require.main) server.listen()
