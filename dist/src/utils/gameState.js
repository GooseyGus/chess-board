// Game state management utilities
const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place white pieces (bottom rows)
  const backRowWhite = [
    PIECE_TYPES.ROOK, PIECE_TYPES.KNIGHT, PIECE_TYPES.BISHOP, PIECE_TYPES.QUEEN,
    PIECE_TYPES.KING, PIECE_TYPES.BISHOP, PIECE_TYPES.KNIGHT, PIECE_TYPES.ROOK
  ];
  
  backRowWhite.forEach((piece, col) => {
    board[7][col] = { type: piece, color: COLORS.WHITE };
  });
  
  // White pawns
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: PIECE_TYPES.PAWN, color: COLORS.WHITE };
  }
  
  // Place black pieces (top rows)
  const backRowBlack = [
    PIECE_TYPES.ROOK, PIECE_TYPES.KNIGHT, PIECE_TYPES.BISHOP, PIECE_TYPES.QUEEN,
    PIECE_TYPES.KING, PIECE_TYPES.BISHOP, PIECE_TYPES.KNIGHT, PIECE_TYPES.ROOK
  ];
  
  backRowBlack.forEach((piece, col) => {
    board[0][col] = { type: piece, color: COLORS.BLACK };
  });
  
  // Black pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK };
  }
  
  return board;
};

const isLightSquare = (row, col) => {
  return (row + col) % 2 === 0;
};

const getSquareColor = (row, col, isSelected) => {
  const isLight = isLightSquare(row, col);
  
  if (isSelected) {
    return isLight ? BOARD_COLORS.LIGHT_SQUARE_SELECTED : BOARD_COLORS.DARK_SQUARE_SELECTED;
  } else {
    return isLight ? BOARD_COLORS.LIGHT_SQUARE : BOARD_COLORS.DARK_SQUARE;
  }
};

// Make available globally
window.createInitialBoard = createInitialBoard;
window.isLightSquare = isLightSquare;
window.getSquareColor = getSquareColor;