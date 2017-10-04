const debug = require('debug')('swyx:server') // run node/nodemon with `DEBUG=swyx:server` prefix to see my debug logs
const path = require('path')

var server = function (middlewareParams) {

  let app = require('./setupServer')(middlewareParams)

  // ************************************
  // here we export the public facing API
  // ************************************

  this.start = (startParams = {}) => {
    const {
      htmlSPA, // catchall to render single page apps. supply `htmlSPA: null` to turn off. defaults to `/public/index.html`.
      socketCallback // off by default. supply a callback fn `io => socket => {socket.on('event', ()=>console.log('event'))}` to turn on
    } = startParams

    if (htmlSPA !== null) {
      const htmlSPApath = htmlSPA || '/public/index.html'
      app.use('*', (req, res) => {
        res.sendFile(path.join(process.env.PWD, htmlSPApath))
      })
    }
    const appserver = app.listen(
      process.env.PORT || 3000,
      () => {
        debug(`--- Started HTTP Server for swyx:server ---`)
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
  app.start = this.start // just a synonym, named `start` so as not to conflict with `app.listen`
  this.app = app
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
  return this
}

module.exports = server

// Start listening only if we're the main module.
// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
if (module === require.main) server.start()
