const GameControls = ({ gameState, onNewGame, onUndo, onFlipBoard }) => {
  const {
    gameStatus,
    winner,
    currentPlayer,
    moveHistory
  } = gameState;

  const getWinnerName = () => {
    if (!winner) return '';
    return winner === COLORS.WHITE ? 'White' : 'Black';
  };

  const getGameStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      return `Checkmate! ${getWinnerName()} wins!`;
    } else if (gameStatus === 'stalemate') {
      return 'Stalemate! Game is a draw.';
    }
    return '';
  };

  const getCurrentPlayerName = () => {
    return currentPlayer === COLORS.WHITE ? 'White' : 'Black';
  };

  return React.createElement('div', {
    className: 'mb-6 flex flex-col items-center gap-3'
  }, [
    // Game status message
    gameStatus ? React.createElement('div', {
      key: 'status-message',
      className: 'text-center p-3 rounded',
      style: { 
        backgroundColor: gameStatus === 'checkmate' ? '#e74c3c' : '#95a5a6',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '16px'
      }
    }, getGameStatusMessage()) : null,
    
    // Turn indicator (only show if game not ended)
    !gameStatus ? React.createElement('div', {
      key: 'turn-info',
      style: { color: BOARD_COLORS.TEXT, fontWeight: 'bold', fontSize: '18px' }
    }, `${getCurrentPlayerName()}'s Turn`) : null,
    
    // Game controls
    React.createElement('div', {
      key: 'game-buttons',
      className: 'flex gap-3'
    }, [
      React.createElement('button', {
        key: 'flip',
        className: 'px-4 py-2 rounded font-semibold transition-colors duration-200',
        style: {
          backgroundColor: BOARD_COLORS.BUTTON,
          color: BOARD_COLORS.TEXT,
          border: 'none',
          cursor: 'pointer'
        },
        onClick: onFlipBoard,
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = BOARD_COLORS.BUTTON_HOVER;
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = BOARD_COLORS.BUTTON;
        }
      }, 'Flip Board'),
      
      React.createElement('button', {
        key: 'new-game',
        className: 'px-4 py-2 rounded font-semibold transition-colors duration-200',
        style: {
          backgroundColor: '#e74c3c',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer'
        },
        onClick: onNewGame,
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = '#c0392b';
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = '#e74c3c';
        }
      }, 'New Game')
    ])
  ]);
};

window.GameControls = GameControls;