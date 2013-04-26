'use strict';

function Game(data) {
  if (data) {
    this.data = data;
  } else {
    this.data = {
      winner: null,
      whoseTurn: null,
      player1: null,
      player2: null,
      title: "Awaiting players ...",
      board: [['', '', ''], ['', '', ''], ['', '', '']]
    };
  }
}

Game.prototype = {
  addPlayer: function(player) {
    if (this.data.player1 != null && this.data.player2 != null) return;
    if (this.data.player1 == null) {
      this.data.player1 = player;
      this.data.whoseTurn = this.data.player1;
    } else {
      this.data.player2 = player;
    }
  },
  title: function() {
    if ( this.isTie() ) {
      this.data.title = "It's a tie!"
    } else if (this.data.winner) {
      this.data.title = this.data.winner + " won!";
    } else {
      if (this.data.player1 != null) {
        this.data.title = this.data.player1 + " vs. ";
        if (this.data.player2 != null) {
          this.data.title = this.data.title + this.data.player2;
        } else {
          this.data.title = this.data.title + "(awaiting 2nd player)";
        }
      }
    }
    return this.data.title;
  },
  board: function() {
    return this.data.board;
  },
  isTie: function() {
    for (var row in [0,1,2]) {
      for (var col in [0,1,2]) {
        if (this.data.board[row][col] === '') return false;
      }
    }
    return true;
  },
  isOver: function() {
    return (this.isTie() || this.data.winner != null);
  },
  isPlayersTurn: function(player) {
    return this.data.whoseTurn === player;
  },
  playerForMark: function(mark) {
    if (mark === 'X') {
      return this.data.player1;
    } else if (mark === 'O') {
      return this.data.player2;
    }
  },
  markForPlayer: function(player) {
    if (player == this.data.player1) {
      return 'X';
    } else if (player == this.data.player2) {
      return 'O';
    }
  },
  nextPlayerToMove: function(player) {
    if (player == this.data.player1) {
      return this.data.player2;
    } else if (player == this.data.player2) {
      return this.data.player1;
    }
  },
  move: function(player, row, col) {
    if ( this.isOver() ) return;
    if ( !this.isPlayersTurn(player) ) return;
    if (row < 0 || row > 2 || col < 0 || col > 2) return;
    if (this.data.board[row][col] != '') return;

    this.data.board[row][col] = this.markForPlayer(player);
    this.data.whoseTurn = this.nextPlayerToMove(player);
    this.data.winner = this.checkForWinner();
  },
  checkForWinner: function() {
    var b = this.data.board;
    //--------------
    // ROW WINS:
    //--------------
    // 0,0  0,1  0,2
    // 1,0  1,1  1,2
    // 2,0  2,1  2,2
    //--------------
    if (b[0][0] != '' && b[0][0] === b[0][1] && b[0][1] === b[0][2]) {
      return this.playerForMark(b[0][0]);
    } else if (b[1][0] != '' && b[1][0] === b[1][1] && b[1][1] === b[1][2]) {
      return this.playerForMark(b[1][0]);
    } else if (b[2][0] != '' && b[2][0] === b[2][1] && b[2][1] === b[2][2]) {
      return this.playerForMark(b[2][0]);
    }

    //--------------
    // COL WINS:
    //--------------
    // 0,0  1,0  2,0
    // 0,1  1,1  2,1
    // 0,2  1,2  2,2
    //--------------
    if (b[0][0] != '' && b[0][0] === b[1][0] && b[1][0] === b[2][0]) {
      return this.playerForMark(b[0][0]);
    } else if (b[0][1] != '' && b[0][1] === b[1][1] && b[1][1] === b[2][1]) {
      return this.playerForMark(b[0][1]);
    } else if (b[0][2] != '' && b[0][2] === b[1][2] && b[1][2] === b[2][2]) {
      return this.playerForMark(b[0][2]);
    }

    //--------------
    // DIAG WINS:
    //--------------
    // 0,0  1,1  2,2
    // 0,2  1,1  2,0
    //--------------
    if (b[0][0] != '' && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      return this.playerForMark(b[0][0]);
    } else if (b[0][2] != '' && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      return this.playerForMark(b[0][2]);
    } else {
      // NO WINNER
      return null;
    }    
  }
}


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

function watchGame($scope, $routeParams) {
  $scope.$watch('games', function() {
    $scope.game = new Game($scope.games[$routeParams.gameId]);
    console.log($scope.game);
  });

  $scope.mouseOver = function(player, row, col, $event) {
    if (! $scope.game.isPlayersTurn(player) ) return;

    if ($scope.game.board()[row][col] == '') {
      $event.target.style.cursor = 'pointer';
    }
  };

  $scope.mouseOut = function($event) {
    $event.target.style.cursor = 'default';
  };
}
