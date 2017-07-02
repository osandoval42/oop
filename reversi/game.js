

const COLORS = require('./colors');
const Player = require('./player');
const Board = require('./board');

function Game(dimension = 8){
	this.dimension = dimension;
}

Game.prototype.start = function(){
	this.board = new Board(this, this.dimension);
	// setTimeout(this.board.setup, 7000);
	this.board.setup();
	this.whitePlayer = new Player(COLORS.WHITE, this);
	this.blackPlayer = new Player(COLORS.BLACK, this);
	this.toMove = this.whitePlayer;
	this.board.render();
	this.runTurn();
}

Game.prototype.toggleToMove = function(){
	this.toMove = (this.toMove === this.whitePlayer) ? this.blackPlayer : this.whitePlayer;
}

Game.prototype.finishTurn = function(){
	if (this.isOver()){
		this.showWinner()
	} else {
		this.toggleToMove();
		this.board.render();
		this.runTurn();
	}
}

Game.prototype.runTurn = function(){
	this.toMove.getAndExecuteMove();
}

Game.prototype.showWinner = function(){
	let blackCount = 0;
	let whiteCount = 0;
	this.board.grid.forEach((row) => {
		row.forEach((piece) => {
			if (piece.color === COLORS.WHITE){
				whiteCount++;
			} else {
				blackCount++
			}
		})
	})
	const winner = (blackCount > whiteCount) ? COLORS.BLACK : COLORS.WHITE;
	console.log(`${winner} WINS!`);
	this.toMove.closeGame()
}

Game.prototype.isOver = function(){
	return (this.board.pieceCount === (this.dimension * this.dimension))
}

const game = new Game();
game.start();