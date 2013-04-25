'use strict';

angular.module('ticTacToe.controllers.game', ['firebase', 'ngCookies'])  
  .controller('GameCtrl', ['$scope', '$routeParams', '$location', '$cookies', 'angularFire', function($scope, $routeParams, $location, $cookies, angularFire) {
    var url = 'https://jeffrey-wescott.firebaseio.com/tictactoe/games';
    var promise = angularFire(url, $scope, 'games');
    $scope.gameOver = false;
    $scope.username = $cookies.username;
    promise.then(function(games) {
      watchGame($scope, $routeParams);
    });
  }]);

function canMakeMove($scope) {
  if ($scope.gameOver) return false;

  if ($scope.username === $scope.game.player1 || $scope.username === $scope.game.player2) {
    return true;
  } else {
    return false;
  }
}

function checkForWinner($scope) {
  var b = $scope.game.board;
  //--------------
  // ROW WINS:
  //--------------
  // 0,0  0,1  0,2
  // 1,0  1,1  1,2
  // 2,0  2,1  2,2
  //--------------
  if (b[0][0] === b[0][1] && b[0][1] === b[0][2]) {
    return b[0][0];
  } else if (b[1][0] === b[1][1] && b[1][1] === b[1][2]) {
    return b[1][0];
  } else if (b[2][0] === b[2][1] && b[2][1] === b[2][2]) {
    return b[2][0];
  }

  //--------------
  // COL WINS:
  //--------------
  // 0,0  1,0  2,0
  // 0,1  1,1  2,1
  // 0,2  1,2  2,2
  //--------------
  if (b[0][0] === b[1][0] && b[1][0] === b[2][0]) {
    return b[0][0];
  } else if (b[0][1] === b[1][1] && b[1][1] === b[2][1]) {
    return b[0][1];
  } else if (b[0][2] === b[1][2] && b[1][2] === b[2][2]) {
    return b[0][2];
  }

  //--------------
  // DIAG WINS:
  //--------------
  // 0,0  1,1  2,2
  // 0,2  1,1  2,0
  //--------------
  if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    return b[0][0];
  } else if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    return b[0][2];
  } else {
    // NO WINNER
    return false;
  }
}

function watchGame($scope, $routeParams) {
  $scope.$watch('games', function() {
    $scope.game = $scope.games[$routeParams.gameId];
    console.log($scope.game);
    if ($scope.game.player1 && $scope.game.player2) {
      $scope.title = $scope.game.player1 + " vs. " + $scope.game.player2;
    } else {
      $scope.title = "Awaiting 2nd player ...";
    }
  });

  $scope.mouseOver = function(row, col, $event) {
    if (!canMakeMove($scope)) return;

    if ($scope.game.board[row][col] == '') {
      $event.target.style.cursor = 'pointer';
    }
  };

  $scope.mouseOut = function($event) {
    if (!canMakeMove($scope)) return;

    $event.target.style.cursor = 'default';
  };

  $scope.move = function(row, col) {
    if (!canMakeMove($scope)) return;

    if ($scope.game.board[row][col] != '') return;

    if ($scope.username === $scope.game.player1) {
      $scope.game.board[row][col] = 'X';
    } else if ($scope.username === $scope.game.player2) {
      $scope.game.board[row][col] = 'O';
    }

    var winner = checkForWinner($scope);
    if (winner) {
      $scope.gameOver = true;
      if (winner === 'X') {
        $scope.title = $scope.game.player1 + " won!";
      } else if (winner === 'O') {
        $scope.title = $scope.game.player2 + " won!";
      }
    }
  };
}
