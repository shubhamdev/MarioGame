


var Game = function(col, row){
    this.init = function(){
      this.Player = null;
      this.Board = null;
      this.bindEvents()
    }

    this.bindEvents = function(){
       document.addEventListener("keydown",(e => {
           if(this.player.mushrooms.length >0){
            switch (e.keyCode){
                case 37:
                    // Left
                    if(this.player.moves[0] !== 0){
                        --this.player.moves[0]
                        this.Board.update(this.player, 'mario1', 'RightLeft');
                        ++this.player.moveCount;
                    } else{
                        this.player.moves[0] = row -1;
                        this.Board.update(this.player, 'mario1', 'RightLeft');
                        ++this.player.moveCount;
                    }
                    this.updateMovesCount();
                    break;
                case 39:
                    // Right
                    if(this.player.moves[0] <= row -2){
                        ++this.player.moves[0]
                        this.Board.update(this.player, 'mario', 'RightLeft');
                        ++this.player.moveCount;
                    }else{
                        this.player.moves[0] = 0;
                        this.Board.update(this.player, 'mario', 'RightLeft');
                        ++this.player.moveCount;
                    }
                    this.updateMovesCount();
                    break;
                case 38:
                    // Up
                    if(this.player.moves[1] !== 0){
                        --this.player.moves[1]
                        this.Board.update(this.player, 'mario1', 'UpDown');
                        ++this.player.moveCount;
                    }else{
                        this.player.moves[1] = col - 1;
                        this.Board.update(this.player, 'mario1', 'UpDown');
                        ++this.player.moveCount;
                    }
                    this.updateMovesCount();
                    break;
                case 40:
                    // Down
                    if(this.player.moves[1] <= col - 2){
                        ++this.player.moves[1]
                        this.Board.update(this.player, 'mario1', 'UpDown');
                        ++this.player.moveCount;
                    }else{
                        this.player.moves[1] = 0;
                        this.Board.update(this.player, 'mario1', 'UpDown');
                        ++this.player.moveCount;
                    }
                    this.updateMovesCount();
                  break;
                default:
                    // code to be executed if n doesn't match any constant
            }
        }
       }))
    }

    this.start = function(){
      this.init();
      this.Board = new Board(); 
      this.player = new Player('Shubham');
      this.Board.createMushroom(col, row, 'mushroo');
      this.Board.create(col, row, this.player);
      this.player.mushrooms = this.Board.possibleMoves();
      this.Board.gameOver(this.player,[{index : 0 , moves: [0,0]}]);
      this.updateMovesCount();
    };
  
    this.updateMovesCount = function(){
        document.getElementById('movesCount').innerText = 'Total move: ' +  this.player.moveCount;
        document.getElementById('movesCount').style.color  = 'red';
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
    this.createMushroom = function (row, col, mushroo) {
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
                    if(i === 0 && j === 0 && col > 1){
                        this._board[i][j].isFood = false;
                        this._board[i][j].class = '';
                        var k = col === j ? j : j+1;
                        this._board[i][k].isFood = true;
                        this._board[i][k].class = 'mushroo'
                        td.className = this._board[i][k].class;
                        this._board[i][k].foodArray = [i, k];
                    }else{
                        td.className = this._board[i][j].class;
                        this._board[i][j].foodArray = [i, j];
                    }
                }
                if(this._board[i][j].isPlayer){
                    td.className = 'mario';
                }
            }
        }
        body.appendChild(tbl);
    };

    this.update = function (player, css, arraow) {
        var _firstColPreviousMove = player.preMoves[1] ,_firstRowPreviousMove = player.preMoves[0],
        _firstRowCurrentMove = player.moves[0], _firstColCurrentMove = player.moves[1];
        var table = document.body;
        table = table.getElementsByTagName('table')[0];
        var tr = table.getElementsByTagName('tr')[_firstColPreviousMove];
        var td = tr.getElementsByTagName('td')[_firstRowPreviousMove];
        td.className = '';
        var tr1 =table.getElementsByTagName('tr')[_firstColCurrentMove]
        var tr2  =tr1.getElementsByTagName('td')[_firstRowCurrentMove];
        tr2.className = css;
        var filterArray = [];
        if(arraow === 'arraow'){
            if(this._board[_firstRowPreviousMove][_firstColPreviousMove].isFood){
                this._board[_firstRowPreviousMove][_firstColPreviousMove].isFood = false;
                this._board[_firstRowPreviousMove][_firstColPreviousMove].isPlayer = true;
            }
            filterArray = player.mushrooms.filter(function(m){ 
                return m.moves[1] === _firstRowCurrentMove && m.moves[0] === _firstColCurrentMove });
        }else{
            if(this._board[_firstColPreviousMove][_firstRowPreviousMove].isFood){
                this._board[_firstColPreviousMove][_firstRowPreviousMove].isFood = false;
                this._board[_firstColPreviousMove][_firstRowPreviousMove].isPlayer = true;
            }
            filterArray = player.mushrooms.filter(function(m){ 
                return m.moves[0] === _firstColCurrentMove && m.moves[1] === _firstRowCurrentMove });
        }
        player.preMoves = [_firstRowCurrentMove , _firstColCurrentMove];
        this.gameOver(player, filterArray);
    }

    this.gameOver = function(player ,filterArray) {
        if(player.mushrooms.length > 0 && filterArray.length >0){
            for(var j = 0; j < player.mushrooms.length; j++){
                if(player.mushrooms[j].index === filterArray[0].index){
                    if((player.mushrooms[j].moves[0] ===filterArray[0].moves[0]) && (player.mushrooms[j].moves[1] ===filterArray[0].moves[1])){
                       player.mushrooms.splice(j, 1);
                    }
                    if(player.mushrooms.length === 0){
                        document.getElementById('gameOver').innerText = 'game over';
                        var count = player.moveCount + 1;
                        alert('Game over and total moves: ' + count);
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
  