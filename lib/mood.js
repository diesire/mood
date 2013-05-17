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

// MongoDB backend
(function(exports) {
    var mongoose = require('mongoose');
    var config = require('./config');
    console.log(config);
    mongoose.connect(config.creds.mongoose_auth_devel);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        console.log('ok---------------');
    });
    var Schema = mongoose.Schema;

    // Create a schema for our data
    var SeedSchema = new Schema({
        word_en: String,
        stemm_en: String,
        word_es: String,
        stemm_es: String,
        mean: Number,
        std_deviation: Number
    });

    // Use the schema to register a model with MongoDb
    mongoose.model('Seed', SeedSchema);
    var Seed = mongoose.model('Seed');

    // 
    exports.get = function(condition, callback) {
        Seed.find(condition, '-_id', callback);
    };

    exports.save = function(callback) {
        var s = new Seed();
        s.word_en = 'qwerty';
        s.stemm_en = 'qwe';
        s.word_es = 'pollo';
        s.stemm_es = 'po';
        s.mean = 5;
        s.std_deviation = 1.2;

        s.save(callback);
    };

    exports.getAll = function(callback) {
        Seed.find({
            word_es: 'abadía'
        }).select('mean').limit(1).exec(callback);
    };
})(exports);


exports.rate = function(text, callback) {

    //empty text -> Error
    if (text === undefined || text === '') {
        throw new Error('Invalid argument');
    }
    
    //tweet -> stemms -> 
    var stemms = tools.stemmer(text);
    stemms.map(function(stemm){
        get({stemm_es: stemm}, callback);
    });

    return text.length;
};




exports.tools = tools;
