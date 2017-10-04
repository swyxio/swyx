const express = require('express')
const setupServer = (middlewareParams = {}) => {
  const {
    userApp,    // supply an express instance if you want, will set one up for you if you don't have one
    bodyParser, // supply `bodyParser: null` to turn off the default json and urlencoded config
    morgan,     // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
    staticRouting, // supply `staticRouting: null` to turn off. defaults to `/public`.
  } = middlewareParams
  
  // accepts modules that you give it if you want to take over
  // if not it supplies its own
  let app = userApp || express()

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

  // **** functionality not yet implemented ***
  // const passport = require('passport')
  // const session = require('express-session');
  // const db = require('../db');
  // const cors = require('cors');
  
  // // take stuff from .env file in development, from process.env in production
  // if (process.env.NODE_ENV === 'development') {
  //   require('dotenv').config();
  // }
  // **** functionality not yet implemented ***
  
  return app
}
module.exports = setupServer