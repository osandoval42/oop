function Tile(){
	this.flagged = false;
	this.revealed = false;
}

Tile.prototype.toString = function(){
	if (this.revealed === true){
		return (this.constructor === Bomb) ? 'B' : this.bombCountString();
	} else {
		return (this.flagged ? 'F' : 'X');
	}
}

Tile.prototype.bombCountString = function(){
	return (this.bombsSurrounding > 0) ? `${this.bombsSurrounding}` : ' '
}

Tile.prototype.toggleFlag = function(){
	this.flagged = !this.flagged;
}

Tile.prototype.reveal = function(){
	this.revealed = true;
}

function Bomb(){
	Tile.call(this);
	this.bombsSurrounding = undefined;
}

Bomb.prototype = Object.create(Tile.prototype);
Bomb.prototype.constructor = Bomb;


function NotBomb(bombsSurrounding){
	Tile.call(this);
	this.bombsSurrounding = bombsSurrounding;
}

NotBomb.prototype = Object.create(Tile.prototype);
NotBomb.prototype.constructor = NotBomb;

module.exports = {NotBomb, Bomb};