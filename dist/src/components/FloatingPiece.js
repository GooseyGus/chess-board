const FloatingPiece = ({ floatingPiece }) => {
  if (!floatingPiece) return null;
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      left: floatingPiece.x - 30,
      top: floatingPiece.y - 30,
      width: '60px',
      height: '60px',
      pointerEvents: 'none',
      zIndex: 1000
    }
  }, React.createElement('img', {
    src: `./assets/pieces/${floatingPiece.piece.color}-${floatingPiece.piece.type}.svg`,
    alt: `${floatingPiece.piece.color} ${floatingPiece.piece.type}`,
    style: {
      width: '60px',
      height: '60px',
      opacity: 0.8,
      transform: 'scale(1.1)'
    }
  }));
};

window.FloatingPiece = FloatingPiece;