const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Basic bounds checking
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
  
  const piece = board[fromRow][fromCol];
  if (!piece) return false;
  
  const targetPiece = board[toRow][toCol];
  
  // Can't capture your own piece
  if (targetPiece && targetPiece.color === piece.color) return false;
  
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

// Get all possible moves for a piece
const getPossibleMoves = (board, row, col) => {
  const moves = [];
  const piece = board[row][col];
  
  if (!piece) return moves;
  
  // Check every square on the board
  for (let toRow = 0; toRow < 8; toRow++) {
    for (let toCol = 0; toCol < 8; toCol++) {
      if (isValidMove(board, row, col, toRow, toCol)) {
        moves.push({ row: toRow, col: toCol });
      }
    }
  }
  
  return moves;
};

const wouldMoveLeaveKingInCheck = (board, fromRow, fromCol, toRow, toCol, playerColor) => {
  // Create a copy of the board with the move applied
  const testBoard = board.map(row => [...row]);
  const piece = testBoard[fromRow][fromCol];
  
  // Apply the move
  testBoard[toRow][toCol] = piece;
  testBoard[fromRow][fromCol] = null;
  
  // Check if king is in check after this move
  return isKingInCheck(testBoard, playerColor);
};

const isKingInCheck = (board, playerColor) => {
  // Find the king
  const kingPosition = findKing(board, playerColor);
  if (!kingPosition) return false;
  
  // Check if any opponent piece can attack the king
  const opponentColor = playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        if (canPieceAttackSquare(board, row, col, kingPosition.row, kingPosition.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

const findKing = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

const canPieceAttackSquare = (board, pieceRow, pieceCol, targetRow, targetCol) => {
  const piece = board[pieceRow][pieceCol];
  if (!piece) return false;
  
  // Use the same movement rules but ignore the "can't capture own piece" rule
  // and ignore the check validation (to prevent infinite recursion)
  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      return canPawnAttackSquare(pieceRow, pieceCol, targetRow, targetCol, piece.color);
    case PIECE_TYPES.ROOK:
      return isValidRookMove(board, pieceRow, pieceCol, targetRow, targetCol);
    case PIECE_TYPES.KNIGHT:
      return isValidKnightMove(pieceRow, pieceCol, targetRow, targetCol);
    case PIECE_TYPES.BISHOP:
      return isValidBishopMove(board, pieceRow, pieceCol, targetRow, targetCol);
    case PIECE_TYPES.QUEEN:
      return isValidQueenMove(board, pieceRow, pieceCol, targetRow, targetCol);
    case PIECE_TYPES.KING:
      return isValidKingMove(pieceRow, pieceCol, targetRow, targetCol);
    default:
      return false;
  }
};

const canPawnAttackSquare = (fromRow, fromCol, toRow, toCol, color) => {
  const direction = color === COLORS.WHITE ? -1 : 1;
  // Pawns can only attack diagonally
  return Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction;
};

const isCheckmate = (board, playerColor) => {
  // If not in check, it's not checkmate
  if (!isKingInCheck(board, playerColor)) return false;
  
  // Check if there are any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        // Check all possible moves for this piece
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, row, col, toRow, toCol)) {
              return false; // Found a legal move, not checkmate
            }
          }
        }
      }
    }
  }
  
  return true; // No legal moves found, it's checkmate
};

const isStalemate = (board, playerColor) => {
  // If in check, it's not stalemate
  if (isKingInCheck(board, playerColor)) return false;
  
  // Check if there are any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        // Check all possible moves for this piece
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, row, col, toRow, toCol)) {
              return false; // Found a legal move, not stalemate
            }
          }
        }
      }
    }
  }
  
  return true; // No legal moves found, it's stalemate
};

const isValidPawnMove = (board, fromRow, fromCol, toRow, toCol, color) => {
  const direction = color === COLORS.WHITE ? -1 : 1;
  const startRow = color === COLORS.WHITE ? 6 : 1;
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
window.isValidMove = isValidMove;
window.getPossibleMoves = getPossibleMoves;
window.isKingInCheck = isKingInCheck;
window.isCheckmate = isCheckmate;
window.isStalemate = isStalemate;