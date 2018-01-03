'use strict'

var request = require('request');
var dbSession = require('../../src/backend/dbSession.js');
var Server = require('../../src/backend/server.js').Server;
var resetDatabase = require('../resetDatabase.js');
var async = require('async');
var port = '8082'

describe('the API', function () {

    var server;

    beforeEach(function (done) {
        server = Server(port);
        server.listen(function (err) {
            resetDatabase(dbSession, function () {
                done(err);
            });
        });
    });

    afterEach(function (done) {
        server.close(function () {
            resetDatabase(dbSession, function () {
                done();
            });
        });
    });

    it('should responde to a GET request at /api/keywords/', function (done) {

        var expected = {
            "_items": [
                { 'id': 1, 'value': 'Aubergine', 'categoryID': 1 },
                { 'id': 2, 'value': 'Onion', 'categoryID': 1 },
                { 'id': 3, 'value': 'Knife', 'categoryID': 2 }
            ]
        };

        async.series(
            [
                function (callback) {
                    dbSession.insert(
                        'keyword',
                        { 'value': 'Aubergine', 'categoryID': 1 },
                        function (err) {
                            callback(err);
                        }
                    );
                },
                function (callback) {
                    dbSession.insert(
                        'keyword',
                        { 'value': 'Onion', 'categoryID': 1 },
                        function (err) {
                            callback(err);
                        }
                    );
                },
                function (callback) {
                    dbSession.insert(
                        'keyword',
                        { 'value': 'Knife', 'categoryID': 2 },
                        function (err) {
                            callback(err);
                        }
                    );
                }
            ],

            function (err, results) {
                if (err) throw err;
                request.get(
                    {
                        'url': 'http://localhost:' + port + '/api/keywords',
                        'json': true
                    },
                    function (err, res, body) {
                        expect(res.statusCode).toBe(200);
                        expect(body._items).toEqual(expected._items);
                        done();
                    });
            }
        );
    });

    it('should respond to a GET request at /api/keywords/categories/', function (done) {
        var expected = {
            "_items": [
                { 'id': 1, 'name': 'Vegetable' },
                { 'id': 2, 'name': 'Utility' }
            ]
        };

        async.series(
            [
                function (callback) {
                    resetDatabase(dbSession, callback);
                },

                function (callback) {
                    dbSession.insert(
                        'category',
                        { 'name': 'Vegetable' },
                        function (err) {
                            callback(err);
                        }
                    );
                },

                function (callback) {
                    dbSession.insert(
                        'category',
                        { 'name': 'Utility' },
                        function (err) {
                            callback(err);
                        }
                    );
                }
            ],

            function (err, results) {
                if (err) throw err;
                request.get(
                    {
                        'url': 'http://localhost:' + port + '/api/keywords/categories/',
                        'json': true
                    },
                    function (err, res, body) {
                        expect(res.statusCode).toBe(200);
                        expect(body._items).toEqual(expected._items);
                        done();
                    }
                );
            }
        );
    });

    it('should create a new keyword when receiving a POST request at /api/keywords/', function (done) {
        var expected = {
            "_items": [
                { 'id': 1, 'value': 'Aubergine', 'categoryID': 1 },
                { 'id': 2, 'value': 'Onion', 'categoryID': 1 },
            ]
        };

        var body = {
            'value': 'Onion',
            'categoryID': 1
        };

        async.series(
            [
                function (callback) {
                    dbSession.insert('category', { 'name': 'Vegetable' }, function (err) { callback(err) });
                },

                function (callback) {
                    dbSession.insert('keyword', { 'value': 'Aubergine', 'categoryID': 1 }, function (err) { callback(err) });
                }
            ],

            function (err, results) {
                if (err) throw (err);
                request.post(
                    {
                        'url': 'http://localhost:' + port + '/api/keywords/',
                        'body': body,
                        'json': true
                    },
                    function (err, res, body) {
                        if (err) throw (err);
                        expect(res.statusCode).toBe(200);
                        request.get(
                            {
                                'url': 'http://localhost:' + port + '/api/keywords/',
                                'json': true
                            },
                            function (err, res, body) {
                                expect(res.statusCode).toBe(200);
                                expect(body._items).toEqual(expected._items);
                                done();
                            }
                        );
                    }
                );
            }
        );
    });

    it('should update a keyword when receiving a POST request at /api/keywords/:id/', function (done) {

        var expected = {
            "_items": [
                { 'id': 1, 'value': 'Purple Onion', 'categoryID': 1 }
            ]
        };

        var body = {
            'id': 1,
            'value': 'Purple Onion',
            'categoryID': 1
        };

        async.series(
            [

                function (callback) {
                    dbSession.insert('category',
                        { 'name': 'Vegetable' },
                        function (err) {
                            callback(err);
                        });
                },

                function (callback) {
                    dbSession.insert('keyword',
                        { 'value': 'Onion', 'categoryID': 1 },
                        function (err) {
                            callback(err);
                        });
                }
            ],

            function (err, results) {
                if (err) throw err;
                request.post(
                    {
                        'url': 'http://localhost:' + port + '/api/keywords/1',
                        'body': body,
                        'json': true
                    },
                    function (err, res, body) {
                        expect(res.statusCode).toBe(200);
                        request.get(
                            {
                                'url': 'http://localhost:' + port + '/api/keywords/',
                                'json': true
                            },
                            function (err, res, body) {
                                expect(res.statusCode).toBe(200);
                                expect(body._items).toEqual(expected._items);
                                done();
                            }
                        );
                    });
            }
        );
    });
});