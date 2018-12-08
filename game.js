


var Game = function(col, row){
    this.init = function(){
      this.Player = null;
      this.Board = null;
      this.bindEvents()
    }

    this.bindEvents = function(){
       document.addEventListener("keydown",(e => {
           if(this.player.mushrooms.length >0){
           if(e && e.keyCode === 37){
               //Right
              if(this.player.moves[0] !== 0){
                 --this.player.moves[0]
                 this.Board.update(this.player, 'mario1', 'RightLeft');
                ++this.player.moveCount;
             } else{
               this.player.moves[0] = row -1;
               this.Board.update(this.player, 'mario1', 'RightLeft');
               ++this.player.moveCount;
             }
           } else if(e && e.keyCode === 39){
            //Right
                if(this.player.moves[0] <= row -2){
                    ++this.player.moves[0]
                    this.Board.update(this.player, 'mario', 'RightLeft');
                    ++this.player.moveCount;
                }else{
                    this.player.moves[0] = 0;
                    this.Board.update(this.player, 'mario', 'RightLeft');
                    ++this.player.moveCount;
                }
           } else if(e && e.keyCode === 38){
               //Up
             if(this.player.moves[1] !== 0){
                --this.player.moves[1]
                this.Board.update(this.player, 'mario1', 'UpDown');
                ++this.player.moveCount;
             }else{
               this.player.moves[1] = col - 1;
               this.Board.update(this.player, 'mario1', 'UpDown');
               ++this.player.moveCount;
             }
           }  else if(e && e.keyCode === 40){
               //Down
             if(this.player.moves[1] <= col - 2){
                ++this.player.moves[1]
                this.Board.update(this.player, 'mario1', 'UpDown');
                ++this.player.moveCount;
             }else{
               this.player.moves[1] = 0;
               this.Board.update(this.player, 'mario1', 'UpDown');
               ++this.player.moveCount;
             }
           } else{
           }
        }
        this.updateMovesCount();
       }))
    }

    this.start = function(){
      this.init();
      this.Board = new Board(); 
      this.player = new Player('Shubham');
      this.Board.createMushroom(col, row);
      this.Board.create(col, row, this.player);
      this.player.mushrooms = this.Board.possibleMoves();
      this.Board.gameOver(this.player,[{index : 0 , moves: [0,0]}]);
    };
  
    this.updateMovesCount = function(){
        document.getElementById('movesCount').innerText = 'total move :' +  this.player.moveCount;
    }
    this.start();
};
  
var Player = function(className){
    this.moveCount = 0;
    this.class = className;
    this.moves = [0, 0];
    this.preMoves = [0,0];
    this.mushrooms = []
};

var Board = function(){

    this._board = [];
    this.createMushroom = function (row, col) {
        row = parseInt(row);
        col = parseInt(col);
        for(var i = 0; i < row; i++){ 
        this._board.push(i);
        this._board[i] = [];
        var food = Math.floor(Math.random() * col-1) + 1;
            for(var j = 0; j < col; j++){
                this._board[i].push({
                    isPlayer: i === 0 && j === 0 ? true : false,
                    isFood: food === j ? true : false,
                    foodArray: [],
                    class: food === j ? 'mushroo' : '',
                    width: 4,
                    height: 4
                });
            }
        }
    };

    this.create = function (row, col) {
        var body = document.getElementById('gameContainer'),
        tbl = document.createElement('table');
        tbl.className = 'gameTable';
        for(var i = 0; i < row; i++){
            var tr = tbl.insertRow();
            for(var j = 0; j < col; j++){
                var td = tr.insertCell();
                td.style.border = '0.1rem solid black';
                td.style.height = this._board[i][j].height + 'rem';
                td.style.width =  this._board[i][j].width +'rem';
                this._board[i][j].foodArray = [];
                if(this._board[i][j].isFood){
                    td.className = this._board[i][j].class;
                    this._board[i][j].foodArray = [i, j];
                }
                if(this._board[i][j].isPlayer){
                    td.className = 'mario';
                }
            }
        }
        body.appendChild(tbl);
    };

    this.update = function (player, css, arraow) {
        var table = document.body;
        table = table.getElementsByTagName('table')[0];
        var tr = table.getElementsByTagName('tr')[player.preMoves[1]];
        var td = tr.getElementsByTagName('td')[player.preMoves[0]];
        td.className = '';
        var tr1 =table.getElementsByTagName('tr')[player.moves[1]]
        var tr2  =tr1.getElementsByTagName('td')[player.moves[0]];
        tr2.className = css;
        var filterArray = [];
        if(arraow === 'arraow'){
            if(this._board[player.preMoves[0]][player.preMoves[1]].isFood){
                this._board[player.preMoves[0]][player.preMoves[1]].isFood = false;
                this._board[player.preMoves[0]][player.preMoves[1]].isPlayer = true;
            }
            filterArray = player.mushrooms.filter(function(m){ 
                return m.moves[1] === player.moves[0] && m.moves[0] === player.moves[1] });
        }else{
            if(this._board[player.preMoves[1]][player.preMoves[0]].isFood){
                this._board[player.preMoves[1]][player.preMoves[0]].isFood = false;
                this._board[player.preMoves[1]][player.preMoves[0]].isPlayer = true;
            }
            filterArray = player.mushrooms.filter(function(m){ 
                return m.moves[0] === player.moves[1] && m.moves[1] === player.moves[0] });
        }
        player.preMoves = [player.moves[0] , player.moves[1]];
        this.gameOver(player, filterArray);
    }

    this.gameOver = function(player ,filterArray) {
        if(player.mushrooms.length > 0 && filterArray.length >0){
            for(var j = 0; j < player.mushrooms.length; j++){
                if(player.mushrooms[j].index === filterArray[0].index){
                    player.mushrooms.splice(j, 1);
                    if(player.mushrooms.length === 0){
                        document.getElementById('gameOver').innerText = 'game over';
                    }
                }
            }
    }
    }
    this.possibleMoves = function() {
        var gameOver = [];
        for(var i = 0; i < this._board.length; i++){
           for(var j = 0; j < this._board[i].length; j++){
             if(this._board[i][j].isFood &&  this._board[i][j].foodArray && this._board[i][j].foodArray.length > 0){
                 gameOver.push( { moves: this._board[i][j].foodArray ,index: i});
             }
           }
         }
        return gameOver;
    }
};

window.onload = function () { 
  var row = prompt("please enter board width", "");
  var col = prompt("please enter board boardHeight", "");
  col = parseInt(col);
  row = parseInt(row);
  if( (col && row )> 0){
    new Game(row, col);
  }
}
  