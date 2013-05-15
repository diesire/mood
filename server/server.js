/*
 * server
 * https://github.com/diesire/mood
 *
 * Copyright (c) 2013 Pablo Escalada Gómez
 * Licensed under the MIT license.
 */

'use strict';

var mood = require('../lib/mood.js');
var restify = require('restify');

var server = restify.createServer({
    name: 'mood_server',
    version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function (req, res, next) {

    res.send(201, {aaa:'aaa'});
    return next();
});

server.post('/rate', function (req, res, next) {

    res.send(201, {rating:'6'});
    return next();
});

server.post('/tools/tokenizer', function (req, res, next) {
    res.send(201, {tokens:mood.tools.tokenizer(req.body.tweet)});
    return next();
});

server.post('/tools/stemmer', function (req, res, next) {
    res.send(201, {tokens:mood.tools.stemmer(req.body.tweet)});
    return next();
});

server.listen(8082, function () {
    console.log('%s listening at %s', server.name, server.url);
});