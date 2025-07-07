const MoveHistory = ({ moveHistory, onUndoMove }) => {
  const formatMove = (move, index) => {
    const { piece, from, to, capturedPiece } = move;
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    
    // Basic chess notation
    let notation = '';
    
    // Piece letter (K=King, Q=Queen, R=Rook, B=Bishop, N=Knight, no letter for pawn)
    if (piece.type !== PIECE_TYPES.PAWN) {
      notation += piece.type.charAt(0).toUpperCase();
      if (piece.type === PIECE_TYPES.KNIGHT) notation = 'N'; // Knight is N, not K
    }
    
    // Capture indicator
    if (capturedPiece) {
      if (piece.type === PIECE_TYPES.PAWN) {
        notation += fromSquare.charAt(0); // Pawn captures show the file
      }
      notation += 'x';
    }
    
    notation += toSquare;
    
    return notation;
  };

  const renderMoveItem = (move, index, originalIndex) => {
    const moveNumber = Math.floor(originalIndex / 2) + 1;
    const isWhiteMove = originalIndex % 2 === 0;
    
    return React.createElement('div', {
      key: originalIndex,
      className: 'flex items-center justify-between p-2 hover:bg-gray-600 rounded text-sm',
      style: {
        backgroundColor: index === 0 ? '#4a5568' : 'transparent' // Highlight first item (most recent)
      }
    }, [
      React.createElement('div', {
        key: 'move-info',
        className: 'flex items-center gap-2'
      }, [
        React.createElement('span', {
          key: 'number',
          className: 'text-xs opacity-75 w-6'
        }, isWhiteMove ? `${moveNumber}.` : ''),
        
        React.createElement('span', {
          key: 'piece',
          style: { fontSize: '16px' }
        }, move.piece.color === COLORS.WHITE ? '♔' : '♚'), // Just show king symbol for color
        
        React.createElement('span', {
          key: 'notation',
          className: 'font-mono'
        }, formatMove(move, originalIndex))
      ]),
      
      // Show undo button for first item only (most recent move)
      index === 0 ? React.createElement('button', {
        key: 'undo',
        className: 'text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded',
        onClick: () => onUndoMove(),
        style: {
          backgroundColor: '#2d3748',
          border: 'none',
          cursor: 'pointer'
        }
      }, '↶') : null
    ]);
  };

  // Reverse the move history to show most recent first
  const reversedMoveHistory = [...moveHistory].reverse();

  return React.createElement('div', {
    className: 'w-full md:w-64 flex flex-col',
    style: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      borderRadius: '8px',
      border: '2px solid #4a5568',
      height: '346px' // Reduced height (354 + 16 gap + 158 = 528px total)
    }
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'p-3 border-b border-gray-600'
    }, [
      React.createElement('h3', {
        className: 'font-bold text-lg'
      }, 'Move History'),
      React.createElement('p', {
        className: 'text-xs opacity-75'
      }, `${moveHistory.length} moves`)
    ]),
    
    React.createElement('div', {
      key: 'moves',
      className: 'flex-1 overflow-y-auto p-2'
    }, moveHistory.length === 0 ? [
      React.createElement('div', {
        key: 'empty',
        className: 'text-center text-gray-400 mt-8'
      }, 'No moves yet')
    ] : reversedMoveHistory.map((move, index) => {
      const originalIndex = moveHistory.length - 1 - index; // Get original index
      return renderMoveItem(move, index, originalIndex);
    }))
  ]);
};

window.MoveHistory = MoveHistory;