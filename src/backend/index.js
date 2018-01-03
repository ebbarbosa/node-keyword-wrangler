'use strict'

var Server = require('./server.js').Server;

var port = '8080';
var server = Server(port);

server.listen(function () {
    console.log('server started listening on port', server.options.port);
});