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
        },
        POST: function (req, res) {
            req.onJson(function (err, newKeyword) {
                if (err) {
                    console.log(err);
                    res.status.interalServerError(err);
                } else {
                    dbSession.query('insert into keyword (value,categoryID) values (?,?);', [newKeyword.value, newKeyword.categoryID],
                        function (err) {
                            if (err) {
                                console.log(err);
                                res.status.interalServerError(err);
                            } else {
                                res.object({ 'status': 'ok', 'id': dbSession.getLastInsertId() }).send();
                            }
                        });
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

    /*
    Note how we handle the /api/keywords/categories route first, and then the /api/keywords/:
    id route. This is important, because if the /api/keywords/:id route would be defined
    first, it would handle /api/keywords/categories requests, interpreting categories as the :id.
    */
    server.route('/api/keywords/:id', {
        POST: function (req, res) {
            var keywordId = req.uri.child();
            req.onJson(function (err, keyword) {
                if (err) {
                    console.log(err);
                    res.status.internalServerError(err);
                } else {
                    dbSession.query('update keyword set value = ?, categoryId = ? where id = ?;', [keyword.value, keyword.categoryID, keywordId],
                        function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status.internalServerError(err);
                            } else {
                                res.object({ 'status': 'ok' }).send();
                            }
                        });
                }
            });
        },

        DELETE: function (req, res) {
            var keywordId = req.uri.child();
            dbSession.query('delete from keyword where id = ?', [keywordId], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status.internalServerError(err);
                } else {
                    res.object({ 'status': 'ok' }).send();
                }
            });
        }
    });

    return server;
}

module.exports = { 'Server': Server };