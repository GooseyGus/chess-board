const ChessBoard = () => {
  const gameState = useChessGame();
  const gameActions = {
    movePiece: gameState.movePiece,
    setSelectedSquare: gameState.setSelectedSquare,
    setPossibleMoves: gameState.setPossibleMoves,
    setMouseDownPiece: gameState.setMouseDownPiece,
    setFloatingPiece: gameState.setFloatingPiece,
    setHoveredSquare: gameState.setHoveredSquare
  };

  const dragHandlers = useDragAndDrop(gameState, gameActions);

  const isSquareSelected = (row, col) => {
    return gameState.selectedSquare && gameState.selectedSquare.row === row && gameState.selectedSquare.col === col;
  };

  const isPossibleMove = (row, col) => {
    return gameState.possibleMoves.some(move => move.row === row && move.col === col);
  };

  const isCapture = (row, col) => {
    return isPossibleMove(row, col) && gameState.boardState[row][col] !== null;
  };

  const isPieceMouseDown = (row, col) => {
    return gameState.mouseDownPiece && gameState.mouseDownPiece.row === row && gameState.mouseDownPiece.col === col;
  };

  const isSquareHovered = (row, col) => {
    return gameState.hoveredSquare && gameState.hoveredSquare.row === row && gameState.hoveredSquare.col === col;
  };

  const showSourceBorder = (row, col) => {
    return isSquareHovered(row, col) && gameState.mouseDownPiece !== null;
  };

  const renderBoard = () => {
    const squares = [];
    const startRow = gameState.isFlipped ? 7 : 0;
    const endRow = gameState.isFlipped ? -1 : 8;
    const rowStep = gameState.isFlipped ? -1 : 1;
    
    for (let row = startRow; row !== endRow; row += rowStep) {
      const startCol = gameState.isFlipped ? 7 : 0;
      const endCol = gameState.isFlipped ? -1 : 8;
      const colStep = gameState.isFlipped ? -1 : 1;
      
      for (let col = startCol; col !== endCol; col += colStep) {
        const piece = gameState.boardState[row][col];
        const isMouseDown = isPieceMouseDown(row, col);
        
        squares.push(
          React.createElement(window.Square, {
            key: `${row}-${col}`,
            row: row,
            col: col,
            piece: isMouseDown ? null : piece,
            isSelected: isSquareSelected(row, col),
            isPossibleMove: isPossibleMove(row, col),
            isCapture: isCapture(row, col),
            isDragTarget: false,
            isMouseDown: isMouseDown,
            showSourceBorder: showSourceBorder(row, col),
            onClick: dragHandlers.handleSquareClick,
            onDrop: () => {},
            onDragOver: () => {},
            onPieceMouseDown: dragHandlers.handlePieceMouseDown,
            onPieceMouseUp: () => {}
          })
        );
      }
    }
    
    return squares;
  };

  return React.createElement('div', {
    className: 'flex flex-col items-center p-8 min-h-screen',
    style: { backgroundColor: BOARD_COLORS.BACKGROUND }
  }, [
    React.createElement('h1', {
      key: 'title',
      className: 'text-3xl font-bold mb-6',
      style: { color: BOARD_COLORS.TEXT }
    }, 'Chess Game'),
    
    React.createElement(window.GameControls, {
      key: 'controls',
      gameState: gameState,
      onNewGame: gameState.newGame,
      onUndo: gameState.undoMove,
      onFlipBoard: gameState.flipBoard
    }),
    
    // Main game area with board and side panels
    React.createElement('div', {
      key: 'game-area',
      className: 'flex gap-8 items-start'
    }, [
      React.createElement('div', {
        key: 'board',
        className: 'grid grid-cols-8 gap-0 shadow-lg',
        style: { border: `4px solid ${BOARD_COLORS.BORDER}` }
      }, renderBoard()),
      
      // Right side panel with move history and captured pieces
      React.createElement('div', {
        key: 'side-panel',
        className: 'flex flex-col gap-4'
      }, [
        React.createElement(window.MoveHistory, {
          key: 'move-history',
          moveHistory: gameState.moveHistory,
          onUndoMove: gameState.undoMove
        }),
        
        React.createElement(window.CapturedPieces, {
          key: 'captured-pieces',
          moveHistory: gameState.moveHistory
        })
      ])
    ]),
    
    React.createElement(window.FloatingPiece, {
      key: 'floating',
      floatingPiece: gameState.floatingPiece
    })
  ]);
};

window.ChessBoard = ChessBoard;