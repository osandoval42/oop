const Pieces = require('./piece');
const readline = require('readline');
const Position = require('position');
const es6Promise = require('es6-promise');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Player(color, board, reader){
	this.color = color;
	this.board = board;
	this.reader = reader;
}

Player.prototype.potentialNonJumpMoves = function(){
	let moves = [];
	this.board.grid.forEach((row) => {
		row.forEach(function (piece){
			if (piece.color === this.color){
				moves.concat(piece.potentialNonJumpMoves());
			}
		})
	})
	return moves;
}

Player.prototype.potentialJumps = function(){
	let moves = [];
	this.board.grid.forEach((row) => {
		row.forEach(function (piece){
			if (piece.color === this.color){
				moves.concat(piece.potentialJumps());
			}
		})
	})
	return moves;
}

Player.prototype.potentialMoves = function(){
	let moves = this.potentialJumps();
	if (moves.length === 0){
		moves = this.potentialNonJumpMoves();
	}
}

Player.prototype.getInitialMove = function(checkValidMove){
	reader.question("Please enter the coordinates from which you want to move in (row, col) format.  For example: 3, 4", function(start){
		reader.question("Please enter the coordinates to which you want to move in (row, col) format.  For example: 4, 5", function(end){
			checkValidMove(start, end);
		})
	})
}

module.exports = Player;