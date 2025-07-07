const useChessGame = () => {
  // State management
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [boardState, setBoardState] = React.useState(() => createInitialBoard());
  const [selectedSquare, setSelectedSquare] = React.useState(null);
  const [possibleMoves, setPossibleMoves] = React.useState([]);
  const [mouseDownPiece, setMouseDownPiece] = React.useState(null);
  const [floatingPiece, setFloatingPiece] = React.useState(null);
  const [hoveredSquare, setHoveredSquare] = React.useState(null);
  const [currentPlayer, setCurrentPlayer] = React.useState(COLORS.WHITE);
  const [gameStatus, setGameStatus] = React.useState(''); // 'check', 'checkmate', 'stalemate', ''
  const [winner, setWinner] = React.useState(null);
  const [moveHistory, setMoveHistory] = React.useState([]); // For undo functionality
  const [enPassantSquare, setEnPassantSquare] = React.useState(null);
  const [castlingRights, setCastlingRights] = React.useState({
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true
  });
  const [promotionDialog, setPromotionDialog] = React.useState(null); // { row, col, color }

  const gameState = {
    enPassantSquare,
    castlingRights
  };

  const checkGameStatus = (board, player) => {
    if (window.isCheckmate(board, player)) {
      const winningPlayer = player === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
      setGameStatus('checkmate');
      setWinner(winningPlayer);
      console.log(`Checkmate! ${winningPlayer} wins!`);
    } else if (window.isStalemate(board, player)) {
      setGameStatus('stalemate');
      setWinner(null);
      console.log('Stalemate! Game is a draw.');
    } else if (window.isKingInCheck(board, player)) {
      setGameStatus('check');
      console.log(`${player} is in check!`);
    } else {
      setGameStatus('');
    }
  };

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = boardState.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    // Store move in history for undo
    const moveRecord = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: piece,
      capturedPiece: capturedPiece,
      boardState: boardState.map(row => [...row]), // Store previous board state
      player: currentPlayer
    };
    
    // Apply the move
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Update state
    setBoardState(newBoard);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMouseDownPiece(null);
    setFloatingPiece(null);
    setHoveredSquare(null);
    
    // Add to move history
    setMoveHistory(prev => [...prev, moveRecord]);
    
    // Switch turns
    const nextPlayer = currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    setCurrentPlayer(nextPlayer);
    
    // Check game status for the next player
    checkGameStatus(newBoard, nextPlayer);
    
    const moveNotation = `${piece.color} ${piece.type} from ${fromRow},${fromCol} to ${toRow},${toCol}`;
    if (capturedPiece) {
      console.log(`${moveNotation} - captured ${capturedPiece.color} ${capturedPiece.type}`);
    } else {
      console.log(moveNotation);
    }
  };

  const undoMove = () => {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    
    // Restore previous board state
    setBoardState(lastMove.boardState);
    setCurrentPlayer(lastMove.player);
    setMoveHistory(prev => prev.slice(0, -1));
    
    // Clear selections and status
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameStatus('');
    setWinner(null);
    
    console.log('Move undone');
  };

  const newGame = () => {
    setBoardState(createInitialBoard());
    setSelectedSquare(null);
    setPossibleMoves([]);
    setCurrentPlayer(COLORS.WHITE);
    setMouseDownPiece(null);
    setFloatingPiece(null);
    setHoveredSquare(null);
    setGameStatus('');
    setWinner(null);
    setMoveHistory([]);
    console.log('New game started');
  };

  const flipBoard = () => {
    setIsFlipped(!isFlipped);
  };

  return {
    // State
    isFlipped,
    boardState,
    selectedSquare,
    possibleMoves,
    mouseDownPiece,
    floatingPiece,
    hoveredSquare,
    currentPlayer,
    gameStatus,
    winner,
    moveHistory,
    // Actions
    movePiece,
    undoMove,
    newGame,
    flipBoard,
    setSelectedSquare,
    setPossibleMoves,
    setMouseDownPiece,
    setFloatingPiece,
    setHoveredSquare
  };
};

window.useChessGame = useChessGame;