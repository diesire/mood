'use strict';

var app = angular.module('serverApp');
app.controller('MainCtrl', function ($scope, $http) {
    $scope.topic = 'universo';
    $scope.max = 6;
    $scope.min = 3;
    $scope.date = '2008-02-02';
    $scope.historyData = [{
            "id": "13",
            "palabra": "universo",
            "positivo": "2",
            "negativo": "3",
            "fecha": "2008-02-02"
        }];

    var search = function (callback) {
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
        success(function (data, status) {
            callback(data);
            $scope.filtered = data;
            console.log('search %o %o', data, status);
        }).
        error(function (data, status) {
            $scope.filtered = status;
            $scope.rated = [];
            $scope.dataArray = [];
            $scope.arrayToData($scope.dataArray);
            $scope.update();
            console.log('search error %o', data);
        });
    };


    var rate = function (source) {
        $http({
            method: 'POST',
            url: '/rate',
            data: source
        }).
        success(function (data, status) {
            $scope.rated = data;

            var dataArray = [['Hora', 'Sentimiento']].concat(data.map(function (element) {
                var date = element.source.fecha.slice(11);
                var rating = element.valoration.rating
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
        error(function (data, status) {
            $scope.rated = status;
            $scope.dataArray = [];
            $scope.arrayToData($scope.dataArray);
            $scope.update();
            console.log('rate error %o', data);
        });
    };

    var showHistory = function (source) {
        var aux = source.map(function (element) {
            console.log(element);
            //todo
        });
        $scope.historyData;
    };

    var history = function (callback) {
        $http({
            method: 'GET',
            url: '/search',
            params: {
                palabra: $scope.topic
            }
        }).
        success(function (data, status) {
            callback(data);
            $scope.filtered = data;
            console.log('histo %o', data);
        }).
        error(function (data, status) {
            $scope.filtered = status;
            $scope.rated = [];
            $scope.dataArray = [];
            $scope.arrayToData($scope.dataArray);
            $scope.update();
            console.log('his err %o', data);
        });
    };

    $scope.fetch = function () {
        search(rate);
    };

    $scope.searchFromHistory = function (data) {
        console.log('sFH %o', data);
        $scope.topic = data.palabra;
        $scope.max = data.positivo;
        $scope.min = data.negativo;
        $scope.date = data.fecha;
        search(rate);
    }

});

app.directive('chart', function () {
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attr) {
            // Create the data table.
            //            var data = new google.visualization.DataTable();
            //            data.addColumn('string', 'Topping');
            //            data.addColumn('number', 'Slices');
            //            data.addRows([
            //                ['Mushrooms', 3],
            //                ['Onions', 1],
            //                ['Olives', 1],
            //                ['Zucchini', 1],
            //                ['Pepperoni', 2]
            //            ]);

            var data = [];
            $scope.arrayToData = function (dataArray) {
                data = google.visualization.arrayToDataTable(dataArray);
            };


            // Set chart options
            $scope.options = {
                'title': 'Sentimientos del dd-mm-AAAA',
                'width': 800,
                'height': 400
            };

            // Instantiate and draw our chart, passing in some options.
            //var chart = new google.visualization.PieChart($elm[0]);
            var chart = new google.visualization.LineChart($elm[0]);
            $scope.update = function () {
                chart.draw(data, $scope.options);
            };
            chart.draw(data, $scope.options);

        }
    }
});

google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['serverApp']);
});
google.load('visualization', '1', {
    packages: ['corechart']
});