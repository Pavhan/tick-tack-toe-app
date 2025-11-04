import type { Player, Winner } from './types';

// Determine how many in a row needed to win based on board size
export const getWinLength = (size: number): number => {
  if (size === 3) return 3;
  if (size === 4) return 4;
  return 5;
};

export const checkWinner = (squares: Player[], size: number): Winner => {
  const winLength = getWinLength(size);

  // Check rows
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const start = row * size + col;
      let isWin = true;
      const player = squares[start];
      if (!player) continue;

      for (let i = 1; i < winLength; i++) {
        if (squares[start + i] !== player) {
          isWin = false;
          break;
        }
      }
      if (isWin) return player;
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - winLength; row++) {
      const start = row * size + col;
      let isWin = true;
      const player = squares[start];
      if (!player) continue;

      for (let i = 1; i < winLength; i++) {
        if (squares[start + i * size] !== player) {
          isWin = false;
          break;
        }
      }
      if (isWin) return player;
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let row = 0; row <= size - winLength; row++) {
    for (let col = 0; col <= size - winLength; col++) {
      const start = row * size + col;
      let isWin = true;
      const player = squares[start];
      if (!player) continue;

      for (let i = 1; i < winLength; i++) {
        if (squares[start + i * (size + 1)] !== player) {
          isWin = false;
          break;
        }
      }
      if (isWin) return player;
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let row = 0; row <= size - winLength; row++) {
    for (let col = winLength - 1; col < size; col++) {
      const start = row * size + col;
      let isWin = true;
      const player = squares[start];
      if (!player) continue;

      for (let i = 1; i < winLength; i++) {
        if (squares[start + i * (size - 1)] !== player) {
          isWin = false;
          break;
        }
      }
      if (isWin) return player;
    }
  }

  // Check for draw
  if (squares.every((square) => square !== null)) {
    return 'Draw';
  }
  return null;
};
