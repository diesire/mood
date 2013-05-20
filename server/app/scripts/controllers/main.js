'use strict';

var app = angular.module('serverApp');
app.controller('MainCtrl', function($scope, $http) {
    $scope.topic = 'universo';
    $scope.max = 6;
    $scope.min = 3;
    $scope.date = '2009-08-19';
    $scope.historyData = [];

    var search = function(callback) {
        $http({
            method: 'GET',
            url: '/search',
            params: {
                palabra: $scope.topic,
                positivo: $scope.max,
                negativo: $scope.min,
                fecha: $scope.date
            }
        }).
        success(function(data, status) {
            callback(data);
            $scope.filtered = data;
            console.log('search %o %o', data, status);
        }).
        error(function(data, status) {
            $scope.filtered = status;
            $scope.rated = [];
            $scope.dataArray = [];
            $scope.arrayToData($scope.dataArray);
            $scope.update();
            console.log('search error %o', data);
        });
    };

    var rate = function(source) {
        $http({
            method: 'POST',
            url: '/rate',
            data: source
        }).
        success(function(data, status) {
            $scope.rated = data;

            console.log('rate %o %o', data, status);

            var dataArray = [
                ['Hora', 'Valoración']
            ].concat(data.map(function(element) {
                var date = element.source.fecha.slice(11);
                var rating = element.valoration.rating;
                console.log('date %o ', date);
                console.log('rating %o ', rating);
                if (!angular.isNumber(rating)) {
                    return [];
                }
                return [date, rating];
            }));

            $scope.arrayToData(dataArray);
            $scope.update();
            $scope.dataArray = dataArray;
            console.log(source);
            history(showHistory);
            console.log('rate %o', data);
        }).
        error(function(data, status) {
            $scope.rated = status;
            $scope.dataArray = [];
            $scope.arrayToData($scope.dataArray);
            $scope.update();
            console.log('rate error %o', data);
        });
    };

    var showHistory = function(source) {
        var aux = source.map(function(element) {
            
            var elementStr = '' + element.fecha + ' [' + element.negativo +
                ', ' + element.positivo + ']';
            return {
                name: elementStr,
                value: element
            };
        });
        $scope.historyData = aux;
    };

    var history = function(callback) {
        $http({
            method: 'GET',
            url: '/history',
            params: {
                palabra: $scope.topic
            }
        }).
        success(function(data, status) {
            console.log('histo %o', data);
            callback(data);
        }).
        error(function(data, status) {
            console.log('his err %o', data);
            callback(data);
        });
    };

    $scope.fetch = function() {
        search(rate);
    };

    $scope.searchFromHistory = function(data) {
        $scope.topic = data.palabra;
        $scope.max = data.positivo;
        $scope.min = data.negativo;
        $scope.date = data.fecha;
        console.log('sFH %o', data);
        $scope.fetch();
    }
});

app.directive('chart', function() {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attr) {
            var data = [];
            $scope.arrayToData = function(dataArray) {
                data = google.visualization.arrayToDataTable(dataArray);
            };

            $scope.options = {
                'title': 'Sentimientos del dd-mm-AAAA',
                'width': 800,
                'height': 400
            };

            var chart = new google.visualization.LineChart($elm[0]);
            $scope.update = function() {
                $scope.options.title = 'Sentimientos del ' + $scope.date;
                chart.draw(data, $scope.options);
            };
            //chart.draw(data, $scope.options);
        }
    }
});

google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['serverApp']);
});
google.load('visualization', '1', {
    packages: ['corechart']
});
