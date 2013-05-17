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
        var hi = 'hi';

        test.expect(1);
        test.equal(mood.rate(hi), hi.length, 'should be text.lenght');
        test.done();
    },

    'Tokenize simple text': function(test) {
        var helloWorld = 'Hola, mundo!';

        test.expect(1);
        test.deepEqual(mood.tools.tokenizer(helloWorld), ['Hola', 'mundo'],
            'should be [Hola, mundo]');
        test.done();
    },

    'Stemmize simple text': function(test) {
        var helloWorld = 'Adiós mundo cruel!';

        test.expect(1);
        test.deepEqual(mood.tools.stemmer(helloWorld), ['adi', 'mundo', 'cruel'],
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

    'Get all seeds ': function(test) {
        mood.get(function(err, data) {
            console.log(data);
            test.expect(1);
            test.ok(true);
            test.done();
        });
    }


};
