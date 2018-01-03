'use strict'

var DBWrapper = require('node-dbi').DBWrapper;

var dbWrapper = new DBWrapper('sqlite3', { 'path' : 'data/sqlite3/keyword-wrangler.test.sqlite'});
dbWrapper.connect();
module.exports = dbWrapper;