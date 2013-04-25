'use strict';


// Declare app level module which depends on filters, and services
angular.module('ticTacToe', ['ticTacToe.filters', 'ticTacToe.services', 'ticTacToe.directives', 'ticTacToe.controllers.games', 'ticTacToe.controllers.game'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/games', {templateUrl: 'partials/games.html', controller: 'GamesCtrl'});
    $routeProvider.when('/games/:gameId', {templateUrl: 'partials/game.html', controller: 'GameCtrl'});
    $routeProvider.otherwise({redirectTo: '/games'});
  }]);
