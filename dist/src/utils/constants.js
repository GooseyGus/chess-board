// Chess piece types
const PIECE_TYPES = {
  KING: 'king',
  QUEEN: 'queen',
  ROOK: 'rook',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  PAWN: 'pawn'
};

// Colors
const COLORS = {
  WHITE: 'white',
  BLACK: 'black'
};

// Board colors
const BOARD_COLORS = {
  LIGHT_SQUARE: '#eeeed2',
  DARK_SQUARE: '#769656',
  LIGHT_SQUARE_SELECTED: '#f5f682',
  DARK_SQUARE_SELECTED: '#b9ca43',
  BACKGROUND: '#2c2b29',
  BORDER: '#4b4847',
  TEXT: '#ffffff',
  BUTTON: '#769656',
  BUTTON_HOVER: '#5a7a42',
  MOVE_DOT_LIGHT: '#cacbb3',
  MOVE_DOT_DARK: '#638046',
  CAPTURE_DOT: '#ff6b6b',
  // New border colors
  BORDER_LIGHT: '#f8f8ef',
  BORDER_LIGHT_SELECTED: '#fcfcd3',
  BORDER_DARK: '#cedac3',
  BORDER_DARK_SELECTED: '#e7edbd'
};

// Make available globally
window.PIECE_TYPES = PIECE_TYPES;
window.COLORS = COLORS;
window.BOARD_COLORS = BOARD_COLORS;