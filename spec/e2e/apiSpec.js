'use strict'

var request = require('request');

describe('the API', function () {
    it('should responde to a GET request at /api/keywords/', function (done) {

        var expected = {
            "_items": [
                {'id': 1, 'value': 'Aubergine', 'categoryID': 1},
                {'id': 2, 'value': 'Onion', 'categoryID': 1},
                {'id': 3, 'value': 'Knife', 'categoryID': 2}
            ]
        };

        request.get(
            {
                'url': 'http://localhost:8080/api/keywords',
                'json': true
            },
            function (err, res, body) {
                expect(res.statusCode).toBe(200);
                expect(body).toEqual(expected);
                done();
            });
    });
});