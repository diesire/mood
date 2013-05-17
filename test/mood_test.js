/*
 * mood_test
 * https://github.com/diesire/mood
 *
 * Copyright (c) 2013 Pablo Escalada Gómez
 * Licensed under the MIT license.
 */

'use strict';

var mood = require('../lib/mood.js');

/*
    To debug nodeunit
    -----------------
    1. node --debug-brk `which nodeunit` test/mood_test.js
    2. node-inspector &
    3. open http://127.0.0.1:8080/debug?port=5858 in chrome
    4. add debugger;
*/


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
    setUp: function(done) {
        done();
    },

    'Rate undefined text': function(test) {
        test.expect(1);
        test.throws(function() {
            mood.rate();
        }, Error, 'should throw an Error');
        test.done();
    },

    'Rate empty text': function(test) {
        test.expect(1);
        test.throws(function() {
            mood.rate("");
        }, Error, 'should throw an Error');
        test.done();
    },

    'Rate simple text': function(test) {
        var hi = 'En un lugar de la Mancha de cuyo nombre no quiero acordarme';

        mood.rate(hi, {
            callback: mood.ratingStrategy.simple,
            args: {
                min: 3,
                max: 6
            }
        }, function(err, data) {
            test.expect(1);
            test.ok(data.raw.length > 0, 'should match some seeds');
            //console.log(data.rating);
            test.done();
        });
    },

    'Tokenize simple text': function(test) {
        var helloWorld = 'Hola, mundo!';

        test.expect(1);
        test.deepEqual(mood.tools.tokenizer(helloWorld), ['Hola', 'mundo'],
            'should be [Hola, mundo]');
        test.done();
    },

    'Stemmize simple text': function(test) {
        var helloWorld = 'Adiós mundo cruel';

        test.expect(1);
        test.deepEqual(mood.tools.stemmer(helloWorld, 'es'), ['adi', 'mundo',
                'cruel'
        ],
            'should be [adi, mundo, cruel]');
        test.done();
    },

    'Detect spanish text': function(test) {
        var text =
            'En un lugar de la Mancha de cuyo nombre no quiero acordarme';
        var language = mood.tools.language(text);

        test.expect(1);
        test.deepEqual(language[0][0], "spanish", 'should be spanish');
        test.done();
    },

    //    'Save seeds ': function(test) {
    //        mood.save(function(err, data) {
    //            test.expect(1);
    //            test.ok(true);
    //            test.done();
    //        });
    //    },

    //    'Batch stemmer ': function(test) {
    //        mood.batchStemmer(function(err, data) {
    //            test.expect(1);
    //            test.equal(data.length, 9180, 'should be 9180');
    //            test.done();
    //        });
    //    },

    'Get all seeds ': function(test) {
        mood.get({}, function(err, data) {
            test.expect(1);
            test.equal(data.length, 9180, 'should have 9180 seeds');
            test.done();
        });
    },

    'Multiple tweets rating': function(test) {
        var tweets = require(
            './tweets').set1;
        var strategy = {
            callback: mood.ratingStrategy.simple,
            args: {
                min: 3,
                max: 6
            }
        };

        test.expect(tweets.length);

        tweets.forEach(function(entry, index) {
            mood.rate(entry.tweet, strategy, function(err, data) {
                test.ok(data.raw.length > 0, 'should match some seeds ');
                if (index === tweets.length - 1) {
                    test.done();
                }
            });
        });
    },

    'Negative tweets rating': function(test) {
        var tweets = require(
            './tweets').negativeSet;
        var strategy = {
            callback: mood.ratingStrategy.simple,
            args: {
                min: 3,
                max: 6
            }
        };

        test.expect(tweets.length);

        tweets.forEach(function(entry, index) {
            mood.rate(entry.tweet, strategy, function(err, data) {
                test.ok(data.rating < 3, 'should be rated < 3 ');
                if (index === tweets.length - 1) {
                    test.done();
                }
            });
        });
    },

    'Neutral tweets rating': function(test) {
        var tweets = require(
            './tweets').neutralSet;
        var strategy = {
            callback: mood.ratingStrategy.simple,
            args: {
                min: 3,
                max: 6
            }
        };

        test.expect(tweets.length);

        tweets.forEach(function(entry, index) {
            mood.rate(entry.tweet, strategy, function(err, data) {
                test.ok(data.rating > 3 && data.rating < 6,
                    'should be rated > 3 and < 6');
                if (index === tweets.length - 1) {
                    test.done();
                }
            });
        });
    },

    'Positive tweets rating': function(test) {
        var tweets = require(
            './tweets').positiveSet;
        var strategy = {
            callback: mood.ratingStrategy.simple,
            args: {
                min: 3,
                max: 6
            }
        };

        test.expect(tweets.length);

        tweets.forEach(function(entry, index) {
            mood.rate(entry.tweet, strategy, function(err, data) {
                test.ok(data.rating > 6,
                    'should be rated > 6');
                if (index === tweets.length - 1) {
                    test.done();
                }
            });
        });
    }
};
