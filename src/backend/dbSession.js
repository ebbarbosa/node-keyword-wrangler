'use strict'

var DBWrapper = require('node-dbi').DBWrapper;

var dbWrapper = new DBWrapper('sqlite3', { 'path' : 'C:\\Users\\barbosed\\keyword-wrangler.db'});
dbWrapper.connect();
module.exports = dbWrapper;