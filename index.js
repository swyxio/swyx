'use strict';

const client = require('./client')
const server = require('./server')

// be extremely clear which side of the `swyx` module you are using. wont be able to just `require('swyx')`

module.exports = {
    client,
    server
}