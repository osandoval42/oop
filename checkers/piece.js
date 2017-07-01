const COLORS = require('./colors');
const Position = require('./position');
const Move = require('./move')

function Piece(color, position, board){
	this.board = board;
	this.color = color;
	this.position = position;
}

Piece.prototype.move = function(move){
	this.position = move.to;
	this.board.setPiece(move.to, this);
	if (move.positionJumped !== undefined){
		this.board.killPiece(move.positionJumped);
	}
	this.board.emptyPosition(move.from);
	if (this.constructor !== King && this.position.row === 0 || this.position.row === 7){
		this.kingMe();
	}
}


Piece.prototype.kingMe = function(){
	const newKing = new King(this.color, this.position, this.board);
	this.board.setPiece(this.position, newKing);
} 

Piece.prototype.toString = function(){
	if (this.constructor === King){
		return (this.color === COLORS.RED ? 'R' : 'B');
	} else if (this.constructor === Piece) {
		return (this.color === COLORS.RED ? 'r' : 'b');
	} else {
		return (((this.position.row + this.position.col) % 2 === 0) ? ' ' : 'X');
	}	
}

Piece.prototype.RedMoveDeltas = [new Position(-1, -1), new Position(-1, 1)]
Piece.prototype.BlackMoveDeltas = [new Position(1, -1), new Position(1, 1)]
Piece.prototype.RedJumpDeltas = [new Position(-2, -2), new Position(-2, 2)]
Piece.prototype.BlackJumpDeltas = [new Position(2, -2), new Position(2, 2)]

Piece.prototype.potentialNonJumpMoves = function(){
	let relevantDeltas;
	if (this.constructor === King){
		relevantDeltas = this.moveDeltas;
	} else {
		relevantDeltas = this.color === COLORS.RED ? this.RedMoveDeltas : this.BlackMoveDeltas;
	}
	let moves = [];
	relevantDeltas.forEach((delta) => {
		const moveTo = delta.sumPositions(this.position);
		if (this.board === undefined){
			debugger;
		}
		if (this.board.isInRange(moveTo)){
			const pieceAtPosition = this.board.getPiece(moveTo);
			if (pieceAtPosition.constructor === NullPiece){
				moves.push(new Move(this.position, moveTo));
			}
		}
	})
	return (moves);
}

Piece.prototype.potentialJumps = function(){
	let relevantDeltas;
	if (this.constructor === King){
		relevantDeltas = this.jumpDeltas;
	} else {
		relevantDeltas = this.color === COLORS.RED ? this.RedJumpDeltas : this.BlackJumpDeltas;
	}
	let moves = [];
	relevantDeltas.forEach((delta) => {
		const moveTo = delta.sumPositions(this.position);
		const jumpedPosition = moveTo.positionJumped(this.position);
		// if (this.board === undefined){
		// 	debugger;
		// }
		if (this.board.isInRange(moveTo) && this.board.isInRange(jumpedPosition)){
			const pieceJumped = this.board.getPiece(jumpedPosition);
			const pieceLandedOn = this.board.getPiece(moveTo);
			if (pieceJumped === undefined || pieceLandedOn === undefined){
			debugger;
			}
			if (pieceJumped.constructor !== NullPiece && pieceJumped.color !== this.color &&
				pieceLandedOn.constructor === NullPiece){
				moves.push(new Move(this.position, moveTo, jumpedPosition));
			}
		}
	})
	return moves;
}

Piece.prototype.potentialMoves = function(){
	let potentialMoves = this.potentialJumps();
	if (potentialJumps.length === 0){
		potentialMoves = this.potentialNonJumpMoves();
	}
	return potentialMoves;
}

function King(color, position, board){
	Piece.call(this, color, position, board);
}

King.prototype = Object.create(Piece.prototype);
King.prototype.constructor = King;

King.prototype.moveDeltas = Piece.prototype.RedMoveDeltas.concat(Piece.prototype.BlackMoveDeltas);
King.prototype.jumpDeltas = Piece.prototype.RedJumpDeltas.concat(Piece.prototype.BlackJumpDeltas);


function NullPiece(pos){
	this.position = pos;
}


NullPiece.prototype = Object.create(Piece.prototype);
NullPiece.prototype.constructor = NullPiece;

const NULL_PLACEHOLDER = new NullPiece();
NullPiece.prototype.newNullPiece = function(){
	return NULL_PLACEHOLDER;
}

module.exports = {NullPiece: NullPiece, Piece: Piece, King: King};



