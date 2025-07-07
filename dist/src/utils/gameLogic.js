const createInitialBoard = () => {
  // Create 8x8 board with pieces in starting positions
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place white pieces (bottom rows)
  const backRowWhite = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  backRowWhite.forEach((piece, col) => {
    board[7][col] = { type: piece, color: 'white' };
  });
  
  // White pawns
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Place black pieces (top rows)
  const backRowBlack = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  backRowBlack.forEach((piece, col) => {
    board[0][col] = { type: piece, color: 'black' };
  });
  
  // Black pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
  }
  
  return board;
};


const isValidMove = (board, fromRow, fromCol, toRow, toCol, gameState) => {
  // Basic bounds checking
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
  
  const piece = board[fromRow][fromCol];
  if (!piece) return false;
  
  const targetPiece = board[toRow][toCol];
  
  // Can't capture your own piece
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  // Special moves check first
  if (piece.type === PIECE_TYPES.KING && Math.abs(toCol - fromCol) === 2) {
    // Castling attempt
    return canCastle(board, fromRow, fromCol, toRow, toCol, piece.color, gameState);
  }
  
  if (piece.type === PIECE_TYPES.PAWN && gameState && gameState.enPassantSquare) {
    // Check for en passant
    if (toRow === gameState.enPassantSquare.row && toCol === gameState.enPassantSquare.col) {
      const direction = piece.color === COLORS.WHITE ? -1 : 1;
      if (fromRow + direction === toRow && Math.abs(fromCol - toCol) === 1) {
        return true;
      }
    }
  }
  
  // Piece-specific movement rules
  let isBasicMoveValid = false;
  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      isBasicMoveValid = isValidPawnMove(board, fromRow, fromCol, toRow, toCol, piece.color);
      break;
    case PIECE_TYPES.ROOK:
      isBasicMoveValid = isValidRookMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case PIECE_TYPES.KNIGHT:
      isBasicMoveValid = isValidKnightMove(fromRow, fromCol, toRow, toCol);
      break;
    case PIECE_TYPES.BISHOP:
      isBasicMoveValid = isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case PIECE_TYPES.QUEEN:
      isBasicMoveValid = isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case PIECE_TYPES.KING:
      isBasicMoveValid = isValidKingMove(fromRow, fromCol, toRow, toCol);
      break;
    default:
      return false;
  }
  
  if (!isBasicMoveValid) return false;
  
  // Check if this move would leave the king in check
  return !wouldMoveLeaveKingInCheck(board, fromRow, fromCol, toRow, toCol, piece.color);
};

const isValidPawnMove = (board, fromRow, fromCol, toRow, toCol, color) => {
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const targetPiece = board[toRow][toCol];
  
  // Forward move
  if (fromCol === toCol) {
    // One square forward
    if (toRow === fromRow + direction && !targetPiece) return true;
    // Two squares forward from starting position
    if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true;
  }
  
  // Diagonal capture
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
    return true;
  }
  
  return false;
};

const isValidRookMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Rook moves horizontally or vertically
  if (fromRow !== toRow && fromCol !== toCol) return false;
  
  // Check if path is clear
  return isPathClear(board, fromRow, fromCol, toRow, toCol);
};

const isValidKnightMove = (fromRow, fromCol, toRow, toCol) => {
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  
  // Knight moves in L-shape: 2+1 or 1+2
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

const isValidBishopMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Bishop moves diagonally
  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
  
  // Check if path is clear
  return isPathClear(board, fromRow, fromCol, toRow, toCol);
};

const isValidQueenMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Queen combines rook and bishop moves
  return isValidRookMove(board, fromRow, fromCol, toRow, toCol) || 
         isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
};

const isValidKingMove = (fromRow, fromCol, toRow, toCol) => {
  // King moves one square in any direction
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  
  return rowDiff <= 1 && colDiff <= 1;
};

const isPathClear = (board, fromRow, fromCol, toRow, toCol) => {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
};

// Make functions available globally
window.createInitialBoard = createInitialBoard;
window.isValidMove = isValidMove;