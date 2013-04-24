'use strict';

/* Controllers */

angular.module('ticTacToe.controllers', ['firebase', 'ngCookies'])  
  .controller('ChatCtrl', ['$scope', '$timeout', 'angularFireCollection', function($scope, $timeout, angularFireCollection) {
    console.log("got here ChatCtrl");

    var el = document.getElementById("messagesDiv");
    var url = 'https://jeffrey-wescott.firebaseio.com/chat';
    $scope.messages = angularFireCollection(url, function() {
      $timeout(function() { el.scrollTop = el.scrollHeight; });
    });
    $scope.username = 'Guest' + Math.floor(Math.random()*101);
    console.log($scope.username);
    $scope.addMessage = function() {
      $scope.messages.add({from: $scope.username, content: $scope.message}, function() {
        el.scrollTop = el.scrollHeight;
      });
      $scope.message = "";
    }
  }])

  .controller('GamesCtrl', ['$scope', '$cookies', 'angularFire', 'filterFilter', function($scope, $cookies, angularFire, filterFilter) {
    var url = 'https://jeffrey-wescott.firebaseio.com/tictactoe/games';
    var promise = angularFire(url, $scope, 'games');

    $scope.username = $cookies.username;

    promise.then(function(games) {
      startWatch($scope, $cookies, filterFilter);
    });
  }])

  .controller('GameCtrl', ['$scope', '$cookies', 'angularFire', function($scope, $cookies, angularFire) {
    $scope.username = $cookies.username;
  }]);


function startWatch($scope, $cookies, filter) {
  $scope.$watch('username', function() {
    $cookies.username = $scope.username;
  });

  $scope.$watch('games', function () {
    console.log($scope.games);
    $scope.waitingGames = filter($scope.games, function(game) {
      console.log(game);
      return (typeof game.player2 === 'undefined');
    });
    console.log($scope.waitingGames);
  }, true);

  $scope.joinGame = function(game) {
    game.player2 = $scope.username;
    console.log("game =", game);
  };

  $scope.createGame = function() {
    console.log("$scope.username =", $scope.username);
    console.log("$scope.games =", $scope.games);
    if (!$scope.username.length) {
      return;
    }

    var game = $scope.games.push({
      player1: $scope.username
    });
    console.log("game =", $scope.games[game]);
  };
}
