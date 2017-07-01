function Move(posFrom, posTo, posJumped){
	this.from = posFrom;
	this.to = posTo
	this.positionJumped = posJumped;
}

Move.prototype.isEqual = function(move){
	return (this.from.isEqual(move.from) && this.to.isEqual(move.to));
}

module.exports = Move;