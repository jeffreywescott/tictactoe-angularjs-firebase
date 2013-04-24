'use strict';


// Declare app level module which depends on filters, and services
// TODO: try removing 'firebase' here
angular.module('ticTacToe', ['firebase', 'ticTacToe.filters', 'ticTacToe.services', 'ticTacToe.directives', 'ticTacToe.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/chat', {templateUrl: 'partials/chat.html', controller: 'ChatCtrl'});
    $routeProvider.when('/games', {templateUrl: 'partials/games.html'});
    $routeProvider.when('/game', {templateUrl: 'partials/game.html', controller: 'GameCtrl'});
    $routeProvider.otherwise({redirectTo: '/games'});
  }]);