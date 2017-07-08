const Players = require('./player');
const Player = Players.Player;
const Computer = Players.Computer;
const Mark = require('./mark');
const Board = require('./board')

function Game(){
	this.board = new Board();
	this.human = new Player(Mark.X, this, this.board);
	this.computer = new Computer(Mark.O, this, this.board);
	this.toMove = this.human;
	this.board.toMove = this.toMove.mark;
}

Game.prototype.switchTurns = function(){
	this.toMove = this.toMove === this.human ? this.computer : this.human;
	this.board.toMove = this.toMove.mark;
}

Game.prototype.start = function(){
	this.takeTurn();
}

Game.prototype.takeTurn = function(){
	this.board.render();
	let winner = this.board.winnerIs()
	if (winner !== undefined){
		return (console.log(`${winner} won!`))
	} 
	if (this.board.isFull()){
		return (console.log('DRAW!'));
	}
	this.toMove.getMove();
}

const game = new Game();
game.start();