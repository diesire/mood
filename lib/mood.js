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
    stemmer: function(text, language) {
        var stemmer;
        if (language === undefined) {
            language = 'es';
        }

        switch (language) {
            case 'es':
                //TODO: BUG: tools.stemmer_es uses PorterStemmer
                //natural.PorterStemmerEs.attach();
                natural.PorterStemmer.attach();
                break;
            case 'en':
                natural.PorterStemmer.attach();
                break;
            default:
                natural.PorterStemmer.attach();
        }
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
    mongoose.connect(config.creds.mongoose_auth_devel);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
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

    exports.batchStemmer = function(callback) {
        Seed.find().exec(function(err, seeds) {
            if (err) {
                callback('Error in find', null);
                return;
            }
            seeds.forEach(function(seed) {
                var stemm_es = tools.stemmer(seed.word_es, 'es');
                var stemm_en = tools.stemmer(seed.word_en, 'en');
                seed.stemm_en = stemm_en;
                seed.stemm_es = stemm_es;
                seed.save(function() {
                    console.log('Update seed %s - %s / %s - %s', seed.word_es,
                        stemm_es, seed.word_en, stemm_en);
                });
            });
            callback(null, seeds);
        });
    };
})(exports);

//tweet -> [stemm] -> [[{seed}]] 
exports.rate = function(text, strategy, callback) {
    //empty text -> Error
    if (text === undefined || text === '') {
        throw new Error('Invalid argument');
    }

    //FIXME: spanish stemmer broken
    var stemms = tools.stemmer(text, 'es');

    var cache = [];
    var steemsRemaining = stemms.length;

    var log = function(err, data) {
        // backend error
        if (err) {
            callback('BackendError', []);
            return;
        }
        if (data != null && data.length > 0) {
            cache.push(data);
        }
        --steemsRemaining;


        if (steemsRemaining <= 0) {
            strategy.args.data = cache;
            
            var ratingV = strategy.callback.call(this, strategy.args);
            callback(null, {
                rating: ratingV,
                raw: cache
            });
        }
    };

    for (var i = 0; i < stemms.length; i++) {
        exports.get({
            stemm_es: stemms[i]
        }, log);
    }
};

(function(exports) {
    exports.ratingStrategy = {
        // tweet mean = words mean
        // stemm selection, first one
        simple: function(args) {
            var data = args.data || [],
                min = args.min || 3,
                max = args.max || 7;

            var filtered = data.filter(function(element, index, array) {
                var rate = element[0].mean;
                return (rate <= min || rate >= max);
            });


            if (filtered.length === 0) {
                return 5.9; //neutro
            }

            if (filtered.length === 1) {
                return filtered[0][0].mean;
            }

            var sum = filtered.reduce(function(previous, current,
                index, array) {
                return previous + current[0].mean;
            }, 0);

            var nElements = filtered.length;
            var rating = sum / nElements;

            return rating;
        }
    };
})(exports);

exports.tools = tools;
