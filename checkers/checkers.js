/*
	Game{
		toMove: .red || .black
	}

	Board{
		grid: 8 x 8 matrix
		render(){
			print R for Red King
			print B for black King
			r
			b
			''
		}
		setPiece(Position, Piece)
		getPiece(Position)
	}

	Piece{
		RedMoveDeltas: [Position{row: 1, col: -1}, Position{row: 1, col: 1}]
		BlackMoveDeltas: [Position{row: -1, col: -1}, Position{row: -1, col: 1}]
		RedJumpDeltas: [Position{row: 2, col: -2}, Position{row: 2, col: 2}]
		BlackJumpDeltas: [Position{row: 2, col: 2}, Position{row: 2, col: 2}]

		color: .red || .black,
		curr_pos: Position,
		potentialMoves(){
			add currPosition to each delta corresponding to color.  Check if no piece is there.  return array
		}
		potentialJumps(){
			add currPosition to each delta corresponding to color.  Check if the position is null, and the position in between is 
			opposite color
		}
	}

	King extends Piece{
		potentialJumps(){
			check using both deltas
		}
		potentialMoves(){
			check using both deltas
		}
		toSTring
	}

	Position{
		row: int,
		col: int
		isEqual(Position){
			row == row and col == col
		}
	}
*/