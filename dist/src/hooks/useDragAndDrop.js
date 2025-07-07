const useDragAndDrop = (gameState, gameActions) => {
  const {
    boardState,
    selectedSquare,
    mouseDownPiece,
    currentPlayer,
    isFlipped
  } = gameState;

  const {
    movePiece,
    setSelectedSquare,
    setPossibleMoves,
    setMouseDownPiece,
    setFloatingPiece,
    setHoveredSquare
  } = gameActions;

  // Detect if we're on mobile
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  React.useEffect(() => {
    // Don't set up drag and drop on mobile
    if (isMobile()) {
      return;
    }

    const handleMouseMove = (e) => {
      if (mouseDownPiece) {
        // Set cursor to grabbing when dragging
        document.body.style.cursor = 'grabbing';
        
        setFloatingPiece({
          ...mouseDownPiece,
          x: e.clientX,
          y: e.clientY
        });
        
        // Find which square the mouse is over
        const boardElement = document.querySelector('.grid.grid-cols-8');
        if (boardElement) {
          const rect = boardElement.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const squareSize = 64;
          let col = Math.floor(x / squareSize);
          let row = Math.floor(y / squareSize);
          
          if (isFlipped) {
            col = 7 - col;
            row = 7 - row;
          }
          
          if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            setHoveredSquare({ row, col });
          } else {
            setHoveredSquare(null);
          }
        }
      }
    };

    const handleMouseUp = (e) => {
      if (mouseDownPiece) {
        // Reset cursor when done dragging
        document.body.style.cursor = 'default';
        
        const fromRow = mouseDownPiece.row;
        const fromCol = mouseDownPiece.col;
        const wasAlreadySelected = mouseDownPiece.wasAlreadySelected;
        
        // Calculate target square from mouse position
        let targetRow = fromRow;
        let targetCol = fromCol;
        
        const boardElement = document.querySelector('.grid.grid-cols-8');
        if (boardElement) {
          const rect = boardElement.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const squareSize = 64;
          let col = Math.floor(x / squareSize);
          let row = Math.floor(y / squareSize);
          
          if (isFlipped) {
            col = 7 - col;
            row = 7 - row;
          }
          
          if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            targetRow = row;
            targetCol = col;
          }
        }
        
        console.log(`Mouse up: from ${fromRow},${fromCol} to ${targetRow},${targetCol}, was initially selected: ${wasAlreadySelected}`);
        
        if (fromRow === targetRow && fromCol === targetCol) {
          // Released on same square
          if (wasAlreadySelected) {
            setSelectedSquare(null);
            setPossibleMoves([]);
            console.log('Deselected piece');
          } else {
            setSelectedSquare({ row: fromRow, col: fromCol });
            const moves = window.getPossibleMoves(boardState, fromRow, fromCol, gameState.gameState);
            setPossibleMoves(moves);
            console.log('Piece stays selected');
          }
        } else {
          // Released on different square
          if (window.isValidMove(boardState, fromRow, fromCol, targetRow, targetCol, gameState.gameState)) {
            // Check if it's the current player's turn
            const piece = boardState[fromRow][fromCol];
            if (piece.color === currentPlayer) {
              movePiece(fromRow, fromCol, targetRow, targetCol);
            } else {
              console.log(`Not ${piece.color}'s turn!`);
              setSelectedSquare({ row: fromRow, col: fromCol });
              const moves = window.getPossibleMoves(boardState, fromRow, fromCol, gameState.gameState);
              setPossibleMoves(moves);
            }
          } else {
            setSelectedSquare({ row: fromRow, col: fromCol });
            const moves = window.getPossibleMoves(boardState, fromRow, fromCol, gameState.gameState);
            setPossibleMoves(moves);
            console.log('Invalid move - piece stays selected');
          }
        }
        
        setMouseDownPiece(null);
        setFloatingPiece(null);
        setHoveredSquare(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Reset cursor when component unmounts
      document.body.style.cursor = 'default';
    };
  }, [mouseDownPiece, isFlipped, boardState, currentPlayer]);

  const handlePieceMouseDown = (row, col, e) => {
    // Don't handle mouse down on mobile - let click handle everything
    if (isMobile()) {
      return;
    }

    const piece = boardState[row][col];
    if (piece) {
      // Only allow interaction with current player's pieces
      if (piece.color !== currentPlayer) {
        console.log(`Not ${piece.color}'s turn!`);
        return;
      }

      const wasAlreadySelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
      
      setMouseDownPiece({ row, col, piece, wasAlreadySelected });
      
      setSelectedSquare({ row, col });
      const moves = window.getPossibleMoves(boardState, row, col);
      setPossibleMoves(moves);
      
      setHoveredSquare({ row, col });
      
      setFloatingPiece({
        row, 
        col, 
        piece,
        x: e.clientX,
        y: e.clientY
      });
      
      console.log(`Mouse down on: ${piece.color} ${piece.type}, was already selected: ${wasAlreadySelected}`);
    }
  };

  const handleSquareClick = (row, col) => {
    const piece = boardState[row][col];
    const isClickOnPossibleMove = gameState.possibleMoves.some(move => move.row === row && move.col === col);
    
    if (selectedSquare && isClickOnPossibleMove) {
      // Check if it's the current player's turn
      const selectedPiece = boardState[selectedSquare.row][selectedSquare.col];
      if (selectedPiece && selectedPiece.color === currentPlayer) {
        movePiece(selectedSquare.row, selectedSquare.col, row, col);
      } else {
        console.log(`Not ${selectedPiece?.color}'s turn!`);
      }
    } else if (piece) {
      // Only allow interaction with current player's pieces
      if (piece.color !== currentPlayer) {
        console.log(`Not ${piece.color}'s turn!`);
        return;
      }

      // Check if clicking on the same piece (deselect)
      if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        console.log('Deselected piece');
      } else {
        // Select this piece and show possible moves
        setSelectedSquare({ row, col });
        const moves = window.getPossibleMoves(boardState, row, col);
        setPossibleMoves(moves);
        console.log(`Selected: ${piece.color} ${piece.type} at ${row}, ${col}`);
      }
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
      console.log('Deselected piece');
    }
  };

  return {
    handlePieceMouseDown,
    handleSquareClick
  };
};

window.useDragAndDrop = useDragAndDrop;