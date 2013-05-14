/*
 * mood
 * https://github.com/diesire/mood
 *
 * Copyright (c) 2013 Pablo Escalada Gómez
 * Licensed under the MIT license.
 */

'use strict';

var natural = require('natural'),
    LanguageDetect = require('languagedetect');


var tools = {
    tokenizer: function(text) {
        return new natural.WordTokenizer().tokenize(text);
    },
    stemmer: function(text) {
        natural.PorterStemmer.attach();
        return text.tokenizeAndStem();
    },
    language: function(text) {
        return new LanguageDetect().detect(text);
    }
};


exports.rate = function (text) {
    
    //empty text -> Error
    if(text === undefined || text === '') {
        throw new Error('Invalid argument');
    }
    
    return text.length;
};


exports.tools = tools;