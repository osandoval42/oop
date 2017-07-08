const readline = require('readline');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const Piece = require('./piece').Piece;
const TicTacToeNode = require('./mini_max');

function Player(mark, game, board){
	this.mark = mark;
	this.game = game;
	this.board = board;
}

Player.prototype.parseMove = function(input){
	input = input.split(', ');
	return input.map((numStr) => {
		return Number(numStr);
	})
}

Player.prototype.getMove = function(){
	reader.question('Please enter move in row, col format\n', (move) => {
		const thisMove = this.parseMove(move);
		this.board.grid[thisMove[0]][thisMove[1]] = new Piece(this.mark);
		this.game.switchTurns()
		this.game.takeTurn();
	})
}

function Computer(mark, game, board){
	Player.call(this, mark, game, board);
}
Computer.prototype = Object.create(Player);
Computer.prototype.constructor = Computer;

/*
	if we find a winner from currBoard. Thats the move
	If we find all losers from curr Board, thats not the move
*/

Computer.prototype.getMove = function(){
	let currStateNode = new TicTacToeNode(this.mark, this.board);
	let thisMove;
	let childrenNodes = currStateNode.children();
	for (let childIdx = 0; childIdx < childrenNodes.length; childIdx++){
		if (childrenNodes[childIdx].isWinningNode(this.mark)){
			thisMove = childrenNodes[childIdx].pos;
			break;
		} 
		if (!childrenNodes[childIdx].isLosingNode(this.mark)){
			thisMove = childrenNodes[childIdx].pos;
		}
	}
	this.board.grid[thisMove[0]][thisMove[1]] = new Piece(this.mark);
	this.game.switchTurns()
	this.game.takeTurn();
}	

module.exports = {Player, Computer};