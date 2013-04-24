'use strict';

/* Controllers */

// TODO: try removing 'firebase' here
angular.module('ticTacToe.controllers', ['firebase'])  
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

  .controller('GamesCtrl', ['$scope', 'angularFire', function($scope, angularFire) {
    var url = 'https://jeffrey-wescott.firebaseio.com/tictactoe/games';
    var promise = angularFire(url, $scope, 'games');

    console.log("got here GamesCtrl");
    $scope.username = "";

    promise.then(function(games) {
      startWatch($scope);
    });
  }])

  .controller('GameCtrl', ['$scope', '$timeout', 'angularFireCollection', function($scope, $timeout, angularFireCollection) {
    console.log("got here GameCtrl");

    $scope.username = "w00t";
  }]);


function startWatch($scope) {

  console.log("got here startWatch");
    
  $scope.$watch('games', function () {
    console.log($scope.games);
  }, true);

  $scope.joinGame = function(game) {
    console.log("game =", game);
  };

  $scope.createGame = function(username) {
    console.log("username =", username);
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
