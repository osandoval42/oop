function Position(row, col){
	this.row = row;
	this.col = col;
}

Position.prototype.sum = function(pos){
	return new Position(this.row + pos.row, this.col + pos.col);
}

module.exports = Position;