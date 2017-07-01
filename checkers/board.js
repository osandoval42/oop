const Pieces = require('./piece');
const Position = require('./position');
const COLORS = require('./colors');
const Move = require('./move');

function Board(){
	this.grid = new Array(8);
	this.setupBoard();
}

Board.prototype.checkValidMoveInput = function(start, end, player){
	let inputs = [start, end];
	let input;
	for (let i = 0; i < inputs.length; i++){
		input = inputs[i];
		if (this.isValidFormattedInput(input)){
			console.log("One of your positions are invalidly formatted (correct is digit, digit)");
			return false;
		}
	}
	const startPos = new Position(Number(start[0]), Number(start[3]))
	const endPos = new Position(Number(end[0]), Number(end[3]))
	if (!this.isInRange(startPos) || !this.isInRange(endPos)){
		console.log("One of your coordinates are out of range.  Please only use numbers 0 to 7");
		return false;
	}
	const move = new Move(startPos, endPos);
	const legalMoves = player.potentialMoves();
	const isLegalMove = legalMoves.some(function(potentialMove){
		const isEqual = move.isEqual(potentialMove);
		if (isEqual === true){
			move.positionJumped = potentialMove.positionJumped;
		}
		return isEqual;
	})
	if (!isLegalMove){
		console.log("Move entered is not legal.  (note that if a jump is available, you have to jump)")
		return false;
	}
	return move;
}

Board.prototype.isValidFormattedInput = function(input){
	return (input.length !== 4 || input[2] !== ' ' || input[1] !== ',' ||
			isNaN(Number(input[0])) || isNaN(Number(input[3])))
}

Board.prototype.setPiece = function(pos, piece, isResurrecting){
	if (isResurrecting){
		if (piece.color === COLORS.RED){
			this.redCount++;
		} else if (piece.color === COLORS.BLACK){
			this.blackCount++;
		} else {
			throw 'RESSURRECTING PIECE WITH NO COLOR'
		}
	}
	this.grid[pos.row][pos.col] = piece;
}

Board.prototype.getPiece = function(pos){
	return this.grid[pos.row][pos.col];
}

Board.prototype.isInRange = function(pos){
	return (pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8);
}

Board.prototype.render = function(){
	let colHeaders = '  ';
	let moreColHeaders = '--';

	for (let i = 0; i < 8; i++){
		colHeaders += ` ${i}`;
		moreColHeaders += '--';
	}
	console.log(colHeaders);
	let row;
	for (let i = 0; i < 8; i++){
		row = `${i}|`
		for (let j = 0; j < 8; j++){
			row += ` ${this.grid[i][j].toString()}`;
		}
		console.log(row);
	}
}

Board.prototype.setupBoard = function(){
	for (let i = 0; i < this.grid.length; i++){
		this.grid[i] = new Array(8);
	}
	for (let i = 0; i < 8; i++){
		for (let j = 0; j < 8; j++){
			let pos = new Position(i, j);
			if ((i + j) % 2 === 0 && i !== 3 && i !== 4){
				this.grid[i][j] = (i > 2) ? new Pieces.Piece(COLORS.RED, pos, this) : new Pieces.Piece(COLORS.BLACK, pos, this);
 			} else {
				this.grid[i][j] = new Pieces.NullPiece(pos);
			}	
		}
	}
	this.redCount = 12;
	this.blackCount = 12;
}

Board.prototype.killPiece = function(position){
	const oldPiece = this.grid[position.row][position.col];
	if (oldPiece.color === COLORS.RED){
		this.redCount--;
	} else if (oldPiece.color === COLORS.BLACK){
		this.blackCount--;
	} else {
		throw (`NO PIECE COLOR FOUND FOR PIECE ${oldPiece.constructor}`);
	}
	this.emptyPosition(position);
}

Board.prototype.emptyPosition = function(position){
	this.grid[position.row][position.col] = new Pieces.NullPiece(position);
}

module.exports = Board;