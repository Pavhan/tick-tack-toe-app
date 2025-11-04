import { useState } from 'react';
import { Board } from '@/components/Board/Board';
import { GameInfo } from '@/components/GameInfo/GameInfo';
import { getNextPlayer } from '@/lib/constants';
import type { HistoryEntry, Player, Winner } from '@/lib/types';
import RightPanel from './components/RightPanel/RightPanel';

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState<Player[]>(Array(boardSize * boardSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Winner>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);

  // Determine how many in a row needed to win based on board size
  const getWinLength = (size: number): number => {
    if (size === 3) return 3;
    if (size === 4) return 4;
    return 5;
  };

  const checkWinner = (squares: Player[], size: number): Winner => {
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

  const handleClick = (index: number) => {
    // Don't allow moves when viewing history
    if (currentHistoryIndex !== null) return;

    if (board[index] || winner) return;
    const currentPlayer = getNextPlayer(isXNext);
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const gameWinner = checkWinner(newBoard, boardSize);

    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(gameWinner);

    // Add to history
    const historyEntry: HistoryEntry = {
      player: currentPlayer,
      position: index,
      gameState: {
        board: newBoard,
        isXNext: !isXNext,
        winner: gameWinner,
      },
    };
    setHistory([...history, historyEntry]);
  };

  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsXNext(true);
    setWinner(null);
    setHistory([]);
    setCurrentHistoryIndex(null);
  };

  const handleBoardSizeChange = (newSize: number) => {
    setBoardSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setIsXNext(true);
    setWinner(null);
    setHistory([]);
    setCurrentHistoryIndex(null);
  };

  const handleHistoryClick = (index: number) => {
    const selectedState = history[index].gameState;
    setBoard(selectedState.board);
    setIsXNext(selectedState.isXNext);
    setWinner(selectedState.winner);
    setCurrentHistoryIndex(index);
  };

  const handleContinueGame = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1].gameState;
      setBoard(lastState.board);
      setIsXNext(lastState.isXNext);
      setWinner(lastState.winner);
    }
    setCurrentHistoryIndex(null);
  };

  return (
    <>
      <main className="flex h-full min-h-screen flex-col items-center gap-4 p-4 md:pr-52">
        <header className="flex w-full items-center justify-between pr-20">
          <h1>Tic Tac Toe Game</h1>
        </header>
        <div className="flex grow flex-col items-center justify-center">
          <GameInfo winner={winner} isXNext={isXNext} />
          <Board
            board={board}
            boardSize={boardSize}
            winner={winner}
            highlightedPosition={currentHistoryIndex !== null ? history[currentHistoryIndex]?.position : null}
            isViewingHistory={currentHistoryIndex !== null}
            onSquareClick={handleClick}
          />
        </div>
      </main>
      <RightPanel
        boardSize={boardSize}
        board={board}
        getWinLength={getWinLength}
        history={history}
        currentHistoryIndex={currentHistoryIndex}
        isViewingHistory={currentHistoryIndex !== null}
        onBoardSizeChange={handleBoardSizeChange}
        onResetGame={resetGame}
        onHistoryClick={handleHistoryClick}
        onContinueGame={handleContinueGame}
      />
    </>
  );
}

export default App;
