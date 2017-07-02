const Tiles = require('./Tile');
const Position = require('./position')

function Board(dimensions, game, bombToTileRatio = .22){
	this.dimensions = dimensions;
	this.game = game;
	this.bombs = Math.round((dimensions * dimensions) * bombToTileRatio);
	this.notBombsUnrevealed = dimensions * dimensions - this.bombs
	this.initiate();
}

Board.prototype.initiate = function(){
	this.grid = new Array(this.dimensions);
	for (let rowIdx = 0; rowIdx < this.dimensions; rowIdx++){
		this.grid[rowIdx] = new Array(this.dimensions);
	}
	this.placeBombs()
	this.placeNotBombs()
}

Board.prototype.placeBombs = function(){
	let bombsPlaced = 0;
	const squares = this.dimensions * this.dimensions;
	while (bombsPlaced < this.bombs){
		let randPosition = Math.floor(Math.random() * squares);
		let position = new Position()
		position.row = Math.floor(randPosition / this.dimensions)
		position.col = randPosition % this.dimensions;
		if (this.grid[position.row][position.col] === undefined){
			this.grid[position.row][position.col] = new Tiles.Bomb();
			bombsPlaced++;
		}
	}
}

Board.prototype.placeNotBombs = function(){
	this.grid.forEach((row, rowIdx) => {
		for (let colIdx = 0; colIdx < this.dimensions; colIdx++) {
			let square = row[colIdx];
			if (square === undefined){
				const pos = new Position(rowIdx, colIdx)
				const surroundingBombs = this.countSurrounding(pos);
				this.grid[pos.row][pos.col] = new Tiles.NotBomb(surroundingBombs)
			}
		}
	})
}

Board.prototype.countSurrounding = function(pos){
	let surroundingBombCount = 0;
	this.forEachSurroundingTile(pos, (neighborPos) => {
		let tile = this.grid[neighborPos.row][neighborPos.col];
		if (tile && tile.constructor === Tiles.Bomb){
			surroundingBombCount++;
		}
	})
	return surroundingBombCount
}

Board.prototype.forEachSurroundingTile = function(middlePos, fn){
	this.deltas.forEach((delta) => {
		let neighborPos = middlePos.sum(delta);
		if (this.isInRange(neighborPos)){
			fn(neighborPos);
		}
	})
}

Board.prototype.deltas = [new Position(-1, -1), new Position(-1, 0), new Position(-1, 1), new Position(0, -1), new Position(0, 1), new Position(1, -1), new Position(1, 0), new Position(1, 1)];


Board.prototype.isInRange = function(pos){
	return (pos.row >= 0 && pos.row < this.dimensions &&
		pos.col >= 0 && pos.col < this.dimensions)
}

Board.prototype.render = function(){
	let colHeader = ' |';
	this.grid[0].forEach((_, colIdx) => {
		colHeader += ` ${colIdx}`;
	})
	console.log(colHeader);
	this.grid.forEach((row, rowIdx) => {
		let rowString = `${rowIdx}|`
		row.forEach((tile) => {
			rowString += ` ${tile.toString()}`
		})
		console.log(rowString);
	})
	console.log('');
}

Board.prototype.ensureValidOutput = function(pos){
	const numsEntered = pos.split(', ');

	if (numsEntered.length !== 2){
		console.log("Invalid input")
		return false;
	}
	let row = Number(numsEntered[0]);
	let col = Number(numsEntered[1]);
	if (isNaN(row) || isNaN(col)){
		console.log("Invalid input")
		return false;
	}
	const selectedPos = new Position(row, col);
	if (!this.isInRange(selectedPos)){
		console.log("dimension out of range")
		return false;
	}
	return selectedPos;
}

Board.prototype.toggleFlag = function(pos){
	this.grid[pos.row][pos.col].toggleFlag();
	this.player.promptForFlags();
}

Board.prototype.enterMove = function(pos){
	this.openPiece(pos);
	if (this.grid[pos.row][pos.col].constructor === Tiles.Bomb){
		this.game.lost();
	} else if (this.notBombsUnrevealed === 0){
		this.game.won();
	} else {
		this.game.runTurn()
	}
}

Board.prototype.openPiece = function(pos){
	const thisTile = this.grid[pos.row][pos.col];
	if (!thisTile.revealed){
		thisTile.reveal()
		this.notBombsUnrevealed--;
		if (thisTile.bombsSurrounding === 0){
			this.forEachSurroundingTile(pos, this.openPiece.bind(this))
		}
	}
}

Board.prototype.revealBombs = function(){
	this.grid.forEach((row) => {
		row.forEach((tile) => {
			if (tile.constructor === Tiles.Bomb){
				tile.reveal();
			}
		})
	})
}

module.exports = Board