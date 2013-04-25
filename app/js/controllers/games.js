'use strict';

angular.module('ticTacToe.controllers.games', ['firebase', 'ngCookies'])  
  .controller('GamesCtrl', ['$scope', '$routeParams', '$location', '$cookies', 'angularFire', 'filterFilter', function($scope, $routeParams, $location, $cookies, angularFire, filterFilter) {
    var url = 'https://jeffrey-wescott.firebaseio.com/tictactoe/games';
    var promise = angularFire(url, $scope, 'games');

    $scope.username = $cookies.username;

    promise.then(function(games) {
      watchGames($scope, $location, $cookies, filterFilter);
    });
  }]);

function watchGames($scope, $location, $cookies, filter) {
  $scope.$watch('username', function() {
    $cookies.username = $scope.username;
  });

  $scope.$watch('games', function () {
    console.log($scope.games);
    $scope.waitingGames = filter($scope.games, function(game) {
      if (typeof game === 'undefined') $scope.games.splice($scope.games.indexOf(game), 1);
      var player2Undefined = (typeof game.player2 === 'undefined');
      var player1NotCurrentUser = (game.player1 != $scope.username);
      return  (player2Undefined && player1NotCurrentUser);
    });
  }, true);

  $scope.joinGame = function(game) {
    game.player2 = $scope.username;

    $location.path("/games/" + $scope.games.indexOf(game));
  };

  $scope.createGame = function() {
    if (!$scope.username.length) {
      return;
    }

    var gameId = $scope.games.push({
      player1: $scope.username,
      board: [['', '', ''], ['', '', ''], ['', '', '']]
    }) - 1;

    $location.path("/games/" + gameId);
  };
}
