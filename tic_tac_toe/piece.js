const Mark = require('./mark');

function Piece(mark){
	this.mark = mark;
}

Piece.prototype.dup = function(){
	return new this.constructor(this.mark);
}

Piece.prototype.toString = function(){
	return this.mark
}

function NullPiece(){
	Piece.call(this, '-');
}
NullPiece.prototype = Object.create(Piece.prototype);
NullPiece.prototype.constructor = NullPiece;

module.exports = {Piece, NullPiece};