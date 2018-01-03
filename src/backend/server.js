'use strict'

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var Server = function (port) {
    var server = Percolator({ 'port': port, 'autolink': false, 'staticDir': __dirname + '/../frontend' });
    server.route('/api/keywords', {
        GET: function (req, res) {
            dbSession.fetchAll('Select id, value, categoryID from keyword order by id', function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status.interalServerError(err);
                } else {
                    res.collection(rows).send();
                }
            });
        }
    });

    server.route('/api/keywords/categories', {
        GET: function (req, res) {
            dbSession.fetchAll('SELECT id, name from category order by id', function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status.interalServerError(err);
                } else {
                    res.collection(rows).send();
                }
            });
        }
    });

    return server;
}

module.exports = { 'Server': Server };