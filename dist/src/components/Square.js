const Square = ({ row, col, piece, isSelected, isPossibleMove, isCapture, onClick, onDrop, onDragOver, isDragTarget, onPieceMouseDown, onPieceMouseUp, onPieceMouseMove, isDragging, isMouseDown, showSourceBorder }) => {
  const renderMoveIndicator = () => {
    if (!isPossibleMove && !isDragTarget) return null;
    
    if (isCapture) {
      // Large circle for captures - touches edges of square
      const isLight = isLightSquare(row, col);
      const circleColor = isLight ? BOARD_COLORS.MOVE_DOT_LIGHT : BOARD_COLORS.MOVE_DOT_DARK;
      
      return React.createElement('div', {
        key: 'capture-indicator',
        className: 'absolute inset-1',
        style: {
          border: `4px solid ${circleColor}`,
          borderRadius: '50%',
          boxSizing: 'border-box'
        }
      });
    } else if (isPossibleMove || isDragTarget) {
      // Small dot for regular moves - color depends on square color
      const isLight = isLightSquare(row, col);
      const dotColor = isLight ? BOARD_COLORS.MOVE_DOT_LIGHT : BOARD_COLORS.MOVE_DOT_DARK;
      
      return React.createElement('div', {
        key: 'move-indicator',
        className: 'move-dot absolute',
        style: {
          width: '20px',
          height: '20px',
          backgroundColor: dotColor,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      });
    }
  };

  const getSquareBackgroundColor = () => {
    if (isDragTarget) {
      const isLight = isLightSquare(row, col);
      return isLight ? '#f0f0a0' : '#a0b060';
    }
    return getSquareColor(row, col, isSelected);
  };

  const getSquareBorder = () => {
    if (!showSourceBorder) return 'none';
    
    const isLight = isLightSquare(row, col);
    const isSquareSelected = isSelected;
    
    let borderColor;
    if (isLight) {
      borderColor = isSquareSelected ? BOARD_COLORS.BORDER_LIGHT_SELECTED : BOARD_COLORS.BORDER_LIGHT;
    } else {
      borderColor = isSquareSelected ? BOARD_COLORS.BORDER_DARK_SELECTED : BOARD_COLORS.BORDER_DARK;
    }
    
    return `3px solid ${borderColor}`;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(row, col);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) {
      onDragOver(row, col);
    }
  };

  const getSquareCursor = () => {
    if (piece) {
      return isMouseDown ? 'grabbing' : 'grab';
    }
    return 'default';
  };

  return React.createElement('div', {
    className: 'chess-square w-16 h-16 flex items-center justify-center relative',
    style: {
      backgroundColor: getSquareBackgroundColor(),
      cursor: getSquareCursor(),
      border: getSquareBorder(),
      boxSizing: 'border-box'
    },
    onClick: () => onClick(row, col),
    onDrop: handleDrop,
    onDragOver: handleDragOver
  }, [
    piece ? React.createElement(window.Piece, {
      key: 'piece',
      type: piece.type,
      color: piece.color,
      isDragging: isDragging,
      isMouseDown: isMouseDown,
      onClick: (e) => {
        e.stopPropagation();
        onClick(row, col);
      },
      onMouseDown: (e) => {
        e.preventDefault();
        if (onPieceMouseDown) {
          onPieceMouseDown(row, col, e);
        }
      },
      onMouseUp: (e) => {
        if (onPieceMouseUp) {
          onPieceMouseUp(row, col, e);
        }
      },
      onMouseMove: (e) => {
        if (onPieceMouseMove) {
          onPieceMouseMove(row, col, e);
        }
      }
    }) : null,
    
    renderMoveIndicator()
  ].filter(Boolean));
};

window.Square = Square;