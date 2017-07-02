const readline = require('readline');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function Player(color, game){
	this.color = color;
	this.game = game;
}

Player.prototype.getAndExecuteMove = function(){
	reader.question(`${this.game.toMove.color}: Please enter a move in row, col format\n`, (input) => {
		let move = this.game.board.checkValidInput(input);
		if (move === false){
			this.game.runTurn();
		} else {
			this.game.board.placePiece(move);
			this.game.finishTurn();
		}
	})
}

Player.prototype.closeGame = function(){
	console.log("Good Bye");
	reader.close();
}

module.exports = Player;