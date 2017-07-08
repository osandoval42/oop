const PIECES = require('./piece');
const NullPiece = PIECES.NullPiece;
const Piece = PIECES.Piece;
const Mark = require('./mark');

function Board(){
	this.grid = [];
	for (let i = 0; i < 3; i++){
		this.grid.push([]);
		for (let j = 0; j < 3; j++){
			this.grid[i].push(new NullPiece());
		}
	}
}

Board.prototype.render = function(){
	this.grid.forEach((row) => {
		let rowStr = '|';
		row.forEach((piece) => {
			rowStr += `${piece.toString()}|`;
		})
		console.log(rowStr);
	})
}

Board.prototype.isFull = function(){
	for (let i = 0; i < 3; i++){		
		for (let j = 0; j < 3; j++){
			if (this.grid[i][j].constructor === NullPiece){
				return false;
			}
		}
	}
	return true;
}

Board.prototype.winnerIs = function(){
	return this.winnerByRow() || this.winnerByCol() || this.winnerByDiag();
}

Board.prototype.winnerByCol = function(){
	for (let colIdx = 0; colIdx < 3; colIdx++){
		let rowIdx = 0;
		let markInCol = this.grid[rowIdx][colIdx].mark;
		rowIdx++;
		for (rowIdx; rowIdx < 3; rowIdx++){
			let thisMark = this.grid[rowIdx][colIdx].mark;
			if (thisMark !== markInCol || thisMark === '-'){
				break;
			}
		}
		if (rowIdx === 3){
			return markInCol;
		}
	}
}

Board.prototype.winnerByRow = function(){
	for (let rowIdx = 0; rowIdx < 3; rowIdx++){// check rows
		let colIdx = 0;
		let piece = this.grid[rowIdx][colIdx];
		let markInRow = piece.mark;
		colIdx++;
		for (colIdx; colIdx < 3; colIdx++){
			let thisMark = this.grid[rowIdx][colIdx].mark;
			if (thisMark !== markInRow || thisMark === '-'){
				break;
			}
		}
		if (colIdx === 3){
			return markInRow;
		}
	}
}

Board.prototype.winnerByDiag = function(){
	if (this.grid[0][0].mark === this.grid[1][1].mark && this.grid[2][2].mark === this.grid[1][1].mark &&
		this.grid[0][0].mark !== '-'){
		return this.grid[0][0].mark;
	}
		if (this.grid[0][2].mark === this.grid[1][1].mark && this.grid[2][0].mark === this.grid[1][1].mark &&
		this.grid[0][2].mark !== '-'){
		return this.grid[0][2].mark;
	}
}

Board.prototype.switchToMove = function(){
	this.toMove = this.toMove === Mark.X ? Mark.O : Mark.X
}

Board.prototype.dup = function(){
	let dup = new Board();
	dup.toMove = this.toMove;
	this.grid.forEach((row, rowIdx) => {
		row.forEach((piece, colIdx) => {
			dup.grid[rowIdx][colIdx] = piece.dup();
		})
	})
	return dup;
}

/* 
for a board state find given move as follows
base case:  board findBestMove called on has a winner.  In this case, return {move: undefined, winner: winner}
In each move we try

*/

module.exports = Board;
