const COLORS = require('./colors');
const Position = require('./position');

function Piece(color, position, board){
	this.board = board;
	this.color = color;
	this.position = position;
}

Piece.prototype.move = function(newPos){
	let positionJumped;
	if (Math.absolute(newPos.row - this.position.row) === 2){
		positionJumped = newPos.positionJumped(this.position);
	}
	this.position = newPos;
	this.board.setPiece(newPos, this);
	if (positionJumped){
		board.killPiece(positionJumped);
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
		return ' ';
	}	
}

Piece.prototype.RedMoveDeltas = [new Position(1, -1), new Position(1, 1)]
Piece.prototype.BlackMoveDeltas = [new Position(-1, -1), new Position(-1, 1)]
Piece.prototype.RedJumpDeltas = [new Position(2, -2), new Position(2, 2)]
Piece.prototype.BlackJumpDeltas = [new Position(-2, -2), new Position(-2, 2)]

Piece.prototype.potentialNonJumpMoves(){
	if (this.constructor === King){
		const relevantDeltas = this.moveDeltas;
	} else {
		const relevantDeltas = this.color === COLORS.RED ? RedMoveDeltas : BlackMoveDeltas;
	}
	let moves = [];
	relevantDeltas.forEach(function (delta){
		const move = delta.sumPositions(this.position);
		const pieceAtPosition = this.board.getPiece(move);
		if (pieceAtPosition.constructor === NullPiece){
			moves.push(move);
		}
	})
	return (moves);
}

Piece.prototype.potentialJumps(){
	if (this.constructor === King){
		const relevantDeltas = this.jumpDeltas;
	} else {
		const relevantDeltas = this.color === COLORS.RED ? RedJumpDeltas : BlackJumpDeltas;
	}
	let moves = [];
	relevantDeltas.forEach(function (delta){
		const move = delta.sumPositions(this.position);
		const jumpedPosition = move.positionJumped(this.position);
		const pieceJumped = this.board.getPiece(jumpedPosition);
		if (pieceJumped.constructor !== NullPiece && pieceJumped.color !== this.color){
			moves.push(move);
		}
	})
	return moves;
}

Piece.prototype.potentialMoves(){
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


function NullPiece(){

}


NullPiece.prototype = Object.create(Piece.prototype);
NullPiece.prototype.constructor = NullPiece;

const NULL_PLACEHOLDER = new NullPiece();
NullPiece.prototype.newNullPiece = function(){
	return NULL_PLACEHOLDER;
}

module.exports = {NullPiece: NullPiece, Piece: Piece, King: King};



