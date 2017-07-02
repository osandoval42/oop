const Pieces = require('./piece')
const Piece = Pieces.Piece;
const NullPiece = Pieces.NullPiece;
const COLORS = require('./colors');
const Position = require('./position');

function Board(game, dimension = 8){
	this.dimension = dimension;
	this.pieceCount = 4;
	this.game = game;
}

Board.prototype.setup = function(){
	this.grid = new Array(this.dimension);
	for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++){
		this.grid[rowIdx] = new Array(this.dimension);
		for (let colIdx = 0; colIdx < this.grid[0].length; colIdx++){
			const pos = new Position(rowIdx, colIdx);
			this.grid[rowIdx][colIdx] = new NullPiece(pos);
		}
	}
	this.grid[3][3] = new Piece(COLORS.WHITE, new Position(3, 3));
	this.grid[4][4] = new Piece(COLORS.WHITE, new Position(4, 4));
	this.grid[4][3] = new Piece(COLORS.BLACK, new Position(4, 3));
	this.grid[3][4] = new Piece(COLORS.BLACK, new Position(3, 4));
	this.createDeltas();
}

Board.prototype.deltas = [new Position(-1, -1), new Position(-1, 0), new Position(0, -1), new Position(-1, 1), new Position(1, -1), new Position(0, 1), new Position(1, 0), new Position(1, 1)];

Board.prototype.createDeltas = function(){
	for (let deltaIdx = 0; deltaIdx < 4; deltaIdx++){
		this.deltas[deltaIdx].opposite = this.deltas[this.deltas.length - 1 - deltaIdx];
		this.deltas[this.deltas.length - 1 - deltaIdx].opposite = this.deltas[deltaIdx];
	}
}

Board.prototype.placePiece = function(position){
	this.grid[position.row][position.col] = new Piece(this.game.toMove.color, position);
	this.pieceCount += 1;
	this.deltas.forEach((delta) => {
		const nextPos = delta.sum(position);
		this.propogateMoveOutward(delta, nextPos);
	})
}

Board.prototype.isInBounds = function(position){
	return (position.row >= 0 && position.col >= 0 && position.row < this.dimension && position.col < this.dimension);
}

Board.prototype.doesCaptureAPiece = function(position){
	const res = this.deltas.some((delta) => {
		const nextPos = delta.sum(position);
		if (!this.isInBounds(nextPos)){
			return false;
		}
		const nextPiece = this.grid[nextPos.row][nextPos.col];
		if (nextPiece.constructor === Piece && nextPiece.color !== this.game.toMove.color){
			if (this.propogateMoveOutward(delta, nextPos) === true){
				return true;
			}
		}
		return false;
	})
	return res;
}

Board.prototype.propogateMoveOutward = function(delta, currPos){
	if (!this.isInBounds(currPos)){
		return false;
	}
	const piece = this.grid[currPos.row][currPos.col];
	if (piece.constructor === NullPiece){
		return false;
	}
	if (piece.color === this.game.toMove.color){
		return true;
	}
	const foundOwnColor = this.propogateMoveOutward(delta, delta.sum(currPos));
	if (foundOwnColor){
		piece.color = this.game.toMove.color;
	}
	return foundOwnColor;
}

Board.prototype.checkValidInput = function(input){
	let inputs = input.split(', ');
	if (inputs.length !== 2){
		console.log("invalid")
		return false;
	}
	const row = Number(inputs[0]);
	const col = Number(inputs[1]);
	if (isNaN(row) || isNaN(col)){
		console.log("invalid")
		return false;
	}
	const move = new Position(row, col);
	if (!this.isInBounds(move)){
		console.log("invalid")
		return false;
	}
	const piece = this.grid[move.row][move.col];
	if (piece.constructor !== NullPiece){
		console.log("invalid")
		return false;
	}
	if (!this.doesCaptureAPiece(move)){
		console.log("invalid")
		return false;
	}
	return move
}

/*
	propogate outward:

	base case: If no good, return false.  Else return true

	call self with increased move.  If return was true then change this piece

	return the retunr we got
*/

Board.prototype.render = function(){
	let header = ' |';
	this.grid[0].forEach((square, idx) => {
		header += ` ${idx}`;
	})
	console.log(header);
	this.grid.forEach((row, rowIdx) => {
		let rowStr = `${rowIdx}|`
		row.forEach((piece, colIdx) => {
			rowStr += ` ${piece.toString()}`;
		})
		console.log(rowStr);
	})
}

module.exports = Board;