const COLORS = require('./colors');
const Position = require('./position');
const Pieces = require('./piece');
const Board = require('./board');
const Player = require('./player')

function Game(){
}

Game.prototype.isOver = function(){
	return (this.board.redCount === 0 || this.board.blackCount === 0)
}

Game.prototype.displayWinMessage = function (){
	this.board.render();
	const winMsg = this.board.redCount === 0 ? "BLACK WON!" : "RED WON!";
	console.log(winMsg);
}

Game.prototype.play = function(){
	this.setup()
	this.nextTurn();
}

Game.prototype.playTurn = function(){
	const currPlayer = this.playerToMove();
	currPlayer.getInitialMove(this.board.checkValidMove);
}

Game.prototype.nextTurn = function(){
	this.swapTurns();
	if (this.isOver()){
		this.displayWinMessage();
		this.playerToMove().askForAnotherGame();
	} else {
		this.board.render();
		this.playTurn();
	}
}

Game.prototype.swapTurns = function(){
	this.toMove = (this.toMove === COLORS.RED) ? COLORS.BLACK : COLORS.RED;
}

Game.prototype.playerToMove = function(){
	return (this.toMove === COLORS.RED ? this.redPlayer : this.blackPlayer);
}

Game.prototype.toMoveString = function(){
	return (this.toMove === COLORS.RED ? "Red" : "Black");
}

Game.prototype.setup = function(){
	this.board = new Board();
	this.board.game = this;
	this.board.setupBoard();
	this.toMove = COLORS.BLACK;
	this.redPlayer = new Player(COLORS.RED, this.board, this);
	this.blackPlayer = new Player(COLORS.BLACK, this.board, this);
}


const game = new Game();
game.play()