const readline = require('readline');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Player(game, board){
	this.game = game;
	this.board = board;
}

Player.prototype.askForMove = function(){
	reader.question("Please enter a position you'de like to move in row, col format. Enter F to be prompted for flags\n", (input) => {
		if (input === 'f' || input === 'F'){
			this.promptForFlags();
		} else {
			const pos = this.board.ensureValidOutput(input)
			if (pos === false){
				this.askForMove();
			}
			this.board.enterMove(pos);
		}
	})
}

Player.prototype.promptForFlags = function(){
	reader.question("Please enter a position you'de like to flag in row, col format. Enter C to be prompted for clicks\n", (input) => {
		if (input === 'c' || input === 'C'){
			this.askForMove();
		} else {
			const pos = this.board.ensureValidOutput(input)
			if (pos !== false){
				this.board.toggleFlag(pos);
				this.board.render();
			}
			this.promptForFlags();
		}
	})
}

Player.prototype.offerReplay = function(){
	reader.question("Would you like to play again (y/n)?\n", (input) => {
		if (input === 'y' || input === 'Y'){
			this.game.start();
		} else {
			console.log("Good Bye\n");
			reader.close();
		}
	})
}

module.exports = Player;