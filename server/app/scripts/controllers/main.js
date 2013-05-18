'use strict';

var app = angular.module('serverApp');
app.controller('MainCtrl', function ($scope, $http) {
    $scope.topic = 'universo';
    $scope.max = 6;
    $scope.min = 3;
    $scope.date = '2008-02-02';


    $scope.fetch = function () {
        function search(callback) {
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
            }).
            error(function (data, status) {
                $scope.filtered = status;
                $scope.rated = [];
                $scope.dataArray = [];
                $scope.arrayToData($scope.dataArray);
                $scope.update();
            });
        }


        function rate(source) {
            $http({
                method: 'POST',
                url: '/rate',
                data: source
            }).
            success(function (data, status) {
                $scope.rated = data;
                //            $scope.dataArray = [
                //          ['Date', 'sentimiento'],
                //            ['2004', 1000],
                //            ['2005', 1170],
                //            ['2006', 660],
                //            ['2007', 1030],
                //            ['2004', 1000],
                //            ['2005', 1170],
                //            ['2006', 660],
                //            ['2007', 1030]
                //            ];
                var dataArray = [['Hora', 'Sentimiento']].concat(data.map(function (element) {
                    var date = element.source.fecha.slice(11);
                    var rating = element.valoration.rating
                    if(!angular.isNumber(rating)){
                        return [];
                    }
                    return [date, rating];
                }));

                $scope.arrayToData(dataArray);
                $scope.update();
                $scope.dataArray = dataArray;
            }).
            error(function (data, status) {
                $scope.rated = status;
                $scope.dataArray = [];
                $scope.arrayToData($scope.dataArray);
                $scope.update();
            });
        }   
        search(rate);        
    };

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