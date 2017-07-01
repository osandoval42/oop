const COLORS = require('./colors');
const Position = require('./position');
const Pieces = require('./piece');
const Board = require('./board;')
const Player = require('./player')

function Game(){
}

Game.prototype.isOver = function(){
	return (this.board.redCount === 0 || this.board.blackCount === 0)
}

Game.prototype.displayWinMessage = function (){
	const winMsg = this.board.redCount === 0 ? "BLACK WON!" : "RED WON!";
	console.log(winMsg);
}

Game.prototype.play = function(){
	this.setup()
	this.board.render();
	this.playTurn();
}

/*
	while game is on
	get start and end pos from player
	make sure the move is valid.  If its not, restart, otherwise, execute move and push the jumped piece
	 onto the moveSeq if a piece was jumped.  
	while the moved piece still has room to jump, ask for an additional move
	if move is valid, make it and check condition (cb recurs vs finishing turn.  
	If move is invalid then place each jumped piece back in stack and move the piece we had moved to its original spot
*/

Game.prototype.playTurn = function(){
	const player = this.toMove === COLORS.RED ? this.redPlayer : this.blackPlayer;
	player.getInitialMove(this.board.checkValidMove);
}

Game.prototype.toMoveString = function(){
	return (this.toMove === COLORS.RED ? "Red" : "Black");
}

Game.prototype.setup = function(){
	this.board = new Board();
	this.board.game = this;
	board.setupBoard();
	this.toMove = COLORS.RED;
	this.redPlayer = new Player(COLORS.RED, this.board);
	this.blackPlayer = new Player(COLORS.BLACK, this.board);
}


const game = new Game();
game.play()