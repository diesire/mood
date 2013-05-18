'use strict';

var express = require('express'),
    app = express(),
    mood = require('../lib/mood.js');

app.configure(function () {
    app.use(express.favicon());
    app.use(express.bodyParser());
    //app.use(express.logger('dev')); //tiny, short, default
    app.use(app.router);
    app.use(express.static(__dirname + '/app'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: false,
        showMessage: false
    }));
});

// Read 
app.get('/', function (req, res) {
    res.contentType('application/json');
    res.send({
        aaa: 'aaa'
    });
});

app.post('/rate', function (req, res) {
    var strategy = {
        callback: mood.ratingStrategy.simple,
        args: {
            min: 3,
            max: 6
        }
    };
    var result = [];
    var remain = req.body.length;
    
    req.body.forEach(function (element) {
        mood.rate(element.tweet, strategy, function (err, data) {
            if (err) {
                res.send(500, cerr);
                return;
            }
            result.push({
                source: element,
                valoration: data
            });
            --remain;

            if (remain === 0) {
                res.contentType('application/json');
                res.send(result);
            }
        });
    });
});

app.post('/tools/tokenizer', function (req, res) {
    res.contentType('application/json');
    res.send({
        tokens: mood.tools.tokenizer(req.body.tweet)
    });
});

app.post('/tools/stemmer', function (req, res) {
    res.contentType('application/json');
    res.send({
        tokens: mood.tools.stemmer(req.body.tweet)
    });
});

app.get('/search', function (req, res) {
    var restify = require('restify');
    var client = restify.createJsonClient({
        url: 'http://156.35.98.15'
    });
    console.log('query: %s', req.query);
    var palabra = req.query.palabra;
    var positivo = req.query.positivo;
    var negativo = req.query.negativo;
    var fecha = req.query.fecha;

    //http://156.35.98.15/consulta_tweets.php?palabra=universo&positivo=2.0&negativo=3.0&fecha=2008-02-02
    var path = '/consulta_tweets.php?palabra=' + palabra + '&positivo=' + positivo + '&negativo=' + negativo + '&fecha=' + fecha;
    client.get(path, function (cerr, creq, cres, cdata) {
        if (cerr) {
            res.send(500, cerr);
            return;
        }
        res.contentType('application/json');
        //console.log(cdata);
        res.send(cdata);
    });
});

app.listen(3001, function () {
    console.log("Listening on 3001");
});