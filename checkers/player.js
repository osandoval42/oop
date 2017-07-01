const readline = require('readline');

const Pieces = require('./piece');
const Position = require('./position');
const es6Promise = require('es6-promise');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Player(color, board, game){
	this.color = color;
	this.board = board;
	this.game = game
}

Player.prototype.potentialNonJumpMoves = function(){
	let moves = [];
	this.board.grid.forEach((row) => {
		row.forEach((piece) => {
			if (piece.color === this.color){
				// //VUELVA
				// if (piece.position.row === 5 && piece.position.col === 1){
				// 	debugger;
				// }
				const theseMoves = piece.potentialNonJumpMoves();
				moves = moves.concat(theseMoves);
				// if (piece.position.row === 5 && piece.position.col === 1){
				// 	debugger;
				// }
			}
		})
	})
	return moves;
}

Player.prototype.potentialJumps = function(){
	let moves = [];
	this.board.grid.forEach((row) => {
		row.forEach((piece) => {
			if (piece.color === this.color){
				moves = moves.concat(piece.potentialJumps());
			}
		})
	})
	return moves;
}

Player.prototype.potentialMoves = function(){
	let moves = this.potentialJumps();
	if (moves.length === 0){
		moves = this.potentialNonJumpMoves();
	}
	return moves;
}

Player.prototype.getInitialMove = function(checkValidMove){
	const that = this;
	reader.question(`${that.color}: Please enter the coordinates from which you want to move in (row, col) format.  For example: 3, 4\n`, function(start){
		reader.question(`${that.color}: Please enter the coordinates to which you want to move in (row, col) format.  For example: 3, 4\n`, function(end){
			const move = that.board.checkValidMoveInput(start, end, that);
			if (move !== false){
				const movingPiece = that.board.getPiece(move.from);
				movingPiece.move(move);
				let thisTurnsMoveHistory = [move];
				that.checkForAdditionalJumps(thisTurnsMoveHistory);
			} else {
				that.game.playTurn()
			}
		})
	})
}

Player.prototype.checkForAdditionalJumps = function(thisTurnsMoveHistory){
	const prevMove = thisTurnsMoveHistory[thisTurnsMoveHistory.length - 1];
	if (prevMove.positionJumped !== undefined){
		const movedPiecePos = prevMove.to;
		const movedPiece = this.board.getPiece(movedPiecePos);
		const additionalJumps = movedPiece.potentialJumps();
		if (additionalJumps.length > 0){
			this.board.render();
			reader.question(`${this.color} Your chosen move leads to additionalJumps.  Please enter a valid set of coordinates to which
				you wish to jump your piece at ${movedPiecePos.row}, ${movedPiecePos.col} from, in row, col form.  ie: 2, 3.\n`, (end) => {
					const move = this.board.checkValidMoveInput(`${movedPiecePos.row}, ${movedPiecePos.col}`, end, this);
					if (move !== false){
						movedPiece.move(move);
						thisTurnsMoveHistory.push(move);
					} 
					this.checkForAdditionalJumps(thisTurnsMoveHistory);
				})
			return;
		} 
	} 
	this.game.nextTurn();
}

Player.prototype.askForAnotherGame = function(){
	reader.question("Would you like to play again (y/n)\n", (answer) => {
		if (answer === 'y' || answer === 'Y'){
			this.game.play();
		} else {
			console.log("Good Bye")
			reader.close();
		}
	})
}

module.exports = Player;