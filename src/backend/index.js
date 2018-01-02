'use strict'

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var port = 8080;
var server = Percolator({ 'port': port });

server.route('/api/keywords',
    {
        GET: function (req, res) {
            dbSession.fetchAll('SELECT id, value, categoryID FROM keyword ORDER BY id', 
            function(err,rows){
                if (err){
                    console.log(err);
                }else{
                    res.collection(rows).send();
                }
            });
        }
    }
);

server.listen(function () {
    console.log('server started listening on port', port);
});