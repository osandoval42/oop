/*
	a node is a winning node for x if{
		all of its children are losing nodes for o (and winning nodes for x)
	}

	a node is a losing node for x if{
		all of its children are winning nodes for o (and losing nodes for x)
	}
*/
const PIECES = require('./piece');
const NullPiece = PIECES.NullPiece;
const Piece = PIECES.Piece;
const Mark = require('./mark');

function TicTacToeNode(toMove, board, pos){
	this.pos = pos
	this.toMove = toMove;
	this.board = board.dup();
}

TicTacToeNode.prototype.opponentsMark = function(){
	return this.toMove === Mark.X ? Mark.O : Mark.X
}

TicTacToeNode.prototype.children = function(){
	let children = []
	this.board.grid.forEach((row, rowIdx) => {
		row.forEach((piece, colIdx) => {
			if (piece.mark === '-'){
				let childNode = new TicTacToeNode(this.opponentsMark(), this.board, [rowIdx, colIdx]);
				childNode.board.grid[rowIdx][colIdx] = new Piece(this.toMove);
				children.push(childNode);
			}
		})
	})
	return children;
}
// win(x) = lose(o) 
TicTacToeNode.prototype.isWinningNode = function(mark){
	if (this.board.winnerIs() === mark){
		return true;
	}
	if (this.board.isFull()){
		return false;
	}

	let children = this.children();

	if (this.toMove === mark){
		return children.some((child) => {
			return child.isWinningNode(mark);
		})
	} else {
		return children.every((child) => {
			return child.isWinningNode(mark);
		})
	}
}

TicTacToeNode.prototype.isLosingNode = function(mark){
	if (this.pos[0] === 2 && this.pos[1] === 1){
		debugger;
	}
	const winner = this.board.winnerIs();
	if (winner && winner !== mark){
		return true;
	}
	if (this.board.isFull()){
		return false;
	}
	let children = this.children();

	let res;
	if (this.toMove === mark){
		res = children.every((child) => {
			return child.isLosingNode(mark);
		})
	} else {
		res = children.some((child) => {
			return child.isLosingNode(mark);
		})
	}
	return res;
}

module.exports = TicTacToeNode;