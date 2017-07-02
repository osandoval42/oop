const COLORS = require('./colors');

function Piece(color, position){
	this.color = color;
	this.pos = position;
}

Piece.prototype.toggleColor = function(){
	this.color = (this.color === COLORS.WHITE) ? COLORS.BLACK : COLORS.WHITE;
}

Piece.prototype.toString = function(){
	if (this.constructor === NullPiece){
		return ' ';
	} else {
		return (this.color === COLORS.WHITE) ? 'W' : 'B';
	}
}


function NullPiece(position){
	Piece.call(this, undefined, position);
}

NullPiece.prototype = Object.create(Piece.prototype);
NullPiece.prototype.constructor = NullPiece;


module.exports = {NullPiece, Piece};