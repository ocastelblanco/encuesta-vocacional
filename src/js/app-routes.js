/* global angular */
var app = angular.module('app');
// Enrutamientos
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl :'views/inicio.html'
        }).otherwise({
            redirectTo: '/'
        });
}]);