const CapturedPieces = ({ moveHistory }) => {
  // Point values for pieces
  const PIECE_VALUES = {
    [PIECE_TYPES.PAWN]: 1,
    [PIECE_TYPES.KNIGHT]: 3,
    [PIECE_TYPES.BISHOP]: 3,
    [PIECE_TYPES.ROOK]: 5,
    [PIECE_TYPES.QUEEN]: 9,
    [PIECE_TYPES.KING]: 0 // King has no point value
  };

  const getCapturedPieces = () => {
    const whiteCaptured = [];
    const blackCaptured = [];
    
    moveHistory.forEach(move => {
      if (move.capturedPiece) {
        if (move.capturedPiece.color === COLORS.WHITE) {
          whiteCaptured.push(move.capturedPiece);
        } else {
          blackCaptured.push(move.capturedPiece);
        }
      }
    });
    
    return { whiteCaptured, blackCaptured };
  };

  const calculatePoints = (pieces) => {
    return pieces.reduce((total, piece) => total + PIECE_VALUES[piece.type], 0);
  };

  const groupPiecesByType = (pieces) => {
    const groups = {};
    pieces.forEach(piece => {
      const key = piece.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(piece);
    });
    
    // Sort groups by piece value (highest first)
    const sortedGroups = Object.entries(groups).sort((a, b) => 
      PIECE_VALUES[b[0]] - PIECE_VALUES[a[0]]
    );
    
    return sortedGroups;
  };

  const renderPieceGroups = (pieces, color) => {
    if (pieces.length === 0) return null;
    
    const groups = groupPiecesByType(pieces);
    
    return React.createElement('div', {
      className: 'flex flex-wrap gap-1'
    }, groups.map(([pieceType, piecesOfType]) => {
      const stackOffset = 5; // 5px spacing between same pieces
      
      return React.createElement('div', {
        key: pieceType,
        className: 'relative',
        style: {
          height: '28px',
          width: `${28 + (piecesOfType.length - 1) * stackOffset}px`,
          marginRight: '4px'
        }
      }, piecesOfType.map((piece, index) => 
        React.createElement('img', {
          key: index,
          src: `./assets/pieces/${piece.color}-${piece.type}.svg`,
          alt: `${piece.color} ${piece.type}`,
          style: {
            width: '28px',
            height: '28px',
            position: 'absolute',
            left: `${index * stackOffset}px`,
            top: '0px',
            zIndex: piecesOfType.length - index,
            filter: 'brightness(0.8)' // Slightly dimmed to show they're captured
          }
        })
      ));
    }));
  };

  const { whiteCaptured, blackCaptured } = getCapturedPieces();
  const whitePoints = calculatePoints(whiteCaptured);
  const blackPoints = calculatePoints(blackCaptured);

  return React.createElement('div', {
    className: 'w-full md:w-64 flex flex-col gap-2',
    style: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      borderRadius: '8px',
      border: '2px solid #4a5568',
      padding: '10px',
      height: '158px' // Keep same height
    }
  }, [
    // White captured pieces (pieces taken by Black)
    React.createElement('div', {
      key: 'white-captured',
      className: 'flex flex-col gap-1'
    }, [
      React.createElement('div', {
        key: 'white-header',
        className: 'flex items-center gap-2'
      }, [
        React.createElement('span', {
          style: { fontSize: '16px' }
        }, '♚'), // Black king symbol (Black captured these)
        React.createElement('span', {
          className: 'text-sm font-semibold'
        }, `${whitePoints} pts`)
      ]),
      
      React.createElement('div', {
        key: 'white-pieces',
        className: 'min-h-7 flex items-center',
        style: {
          backgroundColor: '#1a202c',
          borderRadius: '4px',
          padding: '4px 8px'
        }
      }, renderPieceGroups(whiteCaptured, COLORS.WHITE))
    ]),
    
    // Black captured pieces (pieces taken by White)  
    React.createElement('div', {
      key: 'black-captured',
      className: 'flex flex-col gap-1'
    }, [
      React.createElement('div', {
        key: 'black-header',
        className: 'flex items-center gap-2'
      }, [
        React.createElement('span', {
          style: { fontSize: '16px' }
        }, '♔'), // White king symbol (White captured these)
        React.createElement('span', {
          className: 'text-sm font-semibold'
        }, `${blackPoints} pts`)
      ]),
      
      React.createElement('div', {
        key: 'black-pieces',
        className: 'min-h-7 flex items-center',
        style: {
          backgroundColor: '#1a202c',
          borderRadius: '4px',
          padding: '4px 8px'
        }
      }, renderPieceGroups(blackCaptured, COLORS.BLACK))
    ])
    
    // Removed the point advantage display
  ]);
};

window.CapturedPieces = CapturedPieces;