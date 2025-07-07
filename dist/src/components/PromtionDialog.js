const PromotionDialog = ({ promotionDialog, onPromote }) => {
  if (!promotionDialog) return null;

  const pieces = [
    { type: PIECE_TYPES.QUEEN, symbol: promotionDialog.color === COLORS.WHITE ? '♕' : '♛' },
    { type: PIECE_TYPES.ROOK, symbol: promotionDialog.color === COLORS.WHITE ? '♖' : '♜' },
    { type: PIECE_TYPES.BISHOP, symbol: promotionDialog.color === COLORS.WHITE ? '♗' : '♝' },
    { type: PIECE_TYPES.KNIGHT, symbol: promotionDialog.color === COLORS.WHITE ? '♘' : '♞' }
  ];

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    onClick: (e) => {
      // Don't close on background click
      e.stopPropagation();
    }
  }, React.createElement('div', {
    className: 'bg-gray-800 p-6 rounded-lg shadow-xl',
    style: {
      backgroundColor: '#2d3748',
      border: '2px solid #4a5568'
    }
  }, [
    React.createElement('h3', {
      key: 'title',
      className: 'text-white text-lg font-bold mb-4 text-center'
    }, 'Choose Promotion'),
    
    React.createElement('div', {
      key: 'pieces',
      className: 'flex gap-4'
    }, pieces.map(piece => 
      React.createElement('button', {
        key: piece.type,
        className: 'p-4 bg-gray-700 hover:bg-gray-600 rounded transition-colors',
        style: {
          fontSize: '48px',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: '#1a202c',
          border: '2px solid #4a5568'
        },
        onClick: () => onPromote(piece.type),
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = '#2d3748';
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = '#1a202c';
        }
      }, piece.symbol)
    ))
  ]));
};

window.PromotionDialog = PromotionDialog;