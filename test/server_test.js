/*
 * server_test
 * https://github.com/diesire/mood
 *
 * Copyright (c) 2013 Pablo Escalada Gómez
 * Licensed under the MIT license.
 */

'use strict';

var restify = require('restify');

var tweet = "No dejes que la realidad te estropee una buena historia, pero si haces un documental cuéntame toda la verdad http://tinyurl.com/czqxfow ";

// Creates a JSON client
var client = restify.createJsonClient({
    url: 'http://localhost:8082/'
});


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['test'] = {
    setUp: function (done) {
        done();
    },

    'JSON client': function (test) {
        test.expect(1);
        test.ok(client !== null, 'should not be null');
        test.done();
    },


    'Endpoint': function (test) {
        test.expect(4);
        client.get('/', function (err, req, res, data) {
            test.ok(err === null, 'should not have errors');
            test.ok(req.method === 'GET', 'should be GET');
            test.ok(res.statusCode === 201, 'should be status 201');
            //console.log(JSON.stringify(data, null, 2));
            test.deepEqual(data, {
                aaa: 'aaa'
            }, 'should be an Object');
            test.done();
        });
    },


    'Rate tweet': function (test) {
        test.expect(4);

        client.post('/rate', {
            tweet: tweet
        }, function (err, req, res, data) {
            test.ok(err === null, 'should not have errors');
            test.ok(req.method === 'POST', 'should be POST');
            test.ok(res.statusCode === 201, 'should be status 201');
            test.equal(data.rating, 6, 'shoud have rating property');
            test.done();
        });
    },

    'Tokenize tweet': function (test) {
        test.expect(4);

        client.post('/tools/tokenizer', {
            tweet: 'hola mundo'
        }, function (err, req, res, data) {
            test.ok(err === null, 'should not have errors');
            test.ok(req.method === 'POST', 'should be POST');
            test.ok(res.statusCode === 201, 'should be status 201');
            test.deepEqual(data.tokens, ['hola', 'mundo'], 'shoud have tokens []');
            test.done();
        });
    },
    
    'Stemmize tweet': function (test) {
        test.expect(4);

        client.post('/tools/stemmer', {
            tweet: 'adios mundo cruel'
        }, function (err, req, res, data) {
            test.ok(err === null, 'should not have errors');
            test.ok(req.method === 'POST', 'should be POST');
            test.ok(res.statusCode === 201, 'should be status 201');
            test.deepEqual(data.tokens, ['adio', 'mundo', 'cruel'], 'shoud have tokens []');
            test.done();
        });
    }
};