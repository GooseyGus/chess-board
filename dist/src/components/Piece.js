const Piece = ({ type, color, onClick, onMouseDown, onMouseUp, onMouseMove, isDragging, isMouseDown }) => {
  const imagePath = `./assets/pieces/${color}-${type}.svg`;
  
  // Detect if we're on mobile
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const getCursorStyle = () => {
    if (isMobile()) return 'pointer'; // Use pointer cursor on mobile
    if (isMouseDown === true) return 'grabbing';
    return 'grab';
  };

  return React.createElement('img', {
    src: imagePath,
    alt: `${color} ${type}`,
    draggable: false,
    className: `chess-piece piece select-none transition-transform duration-150 ${
      isDragging ? 'opacity-50 scale-110' : 'hover:scale-110'
    }`,
    style: {
      width: '60px',
      height: '60px',
      userSelect: 'none',
      cursor: getCursorStyle(),
      pointerEvents: isMobile() ? 'none' : 'auto' // Disable pointer events on mobile
    },
    onClick: onClick,
    onMouseDown: isMobile() ? undefined : onMouseDown, // Disable mouse down on mobile
    onMouseUp: isMobile() ? undefined : onMouseUp,
    onMouseMove: isMobile() ? undefined : onMouseMove,
    onError: (e) => {
      e.target.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.fontSize = '60px';
      fallback.style.color = color === 'white' ? '#ffffff' : '#363636';
      fallback.style.cursor = getCursorStyle();
      fallback.textContent = getUnicodeSymbol(type, color);
      e.target.parentNode.appendChild(fallback);
    }
  });
};

const getUnicodeSymbol = (type, color) => {
  const pieceSymbols = {
    white: {
      king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙'
    },
    black: {
      king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟'
    }
  };
  return pieceSymbols[color][type];
};

window.Piece = Piece;