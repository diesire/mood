var restify = require('restify');
var natural = require('natural');
var LanguageDetect = require('languagedetect');

var tweet = "Ha cerrado su Twitter y su Facebook la vidente que dijo en 2004 a la madre de una de las chicas rescatadas en Ohio que su hija había muerto.";

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function (req, res, next) {
	
	res.send(201, "try /echo/:name"
	+ '    /natural/tokenizer/hola%20pablo'
	+ '    /natural/stemmer/hola%20pablo'
    + '    /natural/language/hola%20pablo');
  return next();
});


server.get('/natural/tokenizer/:text', function (req, res, next) {
	var tokenizer = new natural.WordTokenizer();
	res.send(201, {tokens: tokenizer.tokenize(tweet)});
  return next();
});


server.get('/natural/stemmer/:text', function (req, res, next) {
	natural.PorterStemmer.attach();
	res.send(201, {tokens: tweet.tokenizeAndStem()});
  return next();
});

server.get('/natural/language/:text', function (req, res, next) {
	var lngDetector = new LanguageDetect();
	res.send(201, {tokens: lngDetector.detect(tweet, 2)});
  return next();
});


server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.listen(8081, function () {
  console.log('%s listening at %s', server.name, server.url);
});