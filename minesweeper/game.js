const Board = require('./board')
const Player = require('./player');

function Game(dimensions = 9){
	this.dimensions = dimensions
}

Game.prototype.start = function(){
	this.setup();
	this.runTurn();
}

Game.prototype.setup = function(){
	this.board = new Board(this.dimensions, this);
	this.player = new Player(this, this.board);
	this.board.player = this.player;
}

Game.prototype.runTurn = function(){
	this.board.render();
	this.player.askForMove();
}

Game.prototype.won = function(){
	console.log("YOU WON");
	this.displayBombsAndOfferReplay()
}

Game.prototype.lost = function(){
	console.log("YOU LOST");
	this.displayBombsAndOfferReplay()
}
Game.prototype.displayBombsAndOfferReplay = function(){
	this.board.revealBombs();
	this.board.render();
	this.player.offerReplay();
}


const game = new Game();
game.start()