function Position(row, col){
	this.row = row;
	this.col = col;
}

Position.prototype.positionJumped = function(position){
	const rowJumped = this.getMedian(this.row, position.row);
	const colJumped = this.getMedian(this.col, position.col);
	return (new Position(rowJumped, colJumped));
}

Position.prototype.getMedian = function(int1, int2){
	return (int1 > int2) ? int1 - 1 : int2 - 1
}

Position.prototype.isEqual = function(position){
	return (this.row === position.row && this.col === position.col);
}

Position.prototype.sumPositions = function(position){
	return new Position(this.row + position.row, this.col + position.col);
}

module.exports = Position;