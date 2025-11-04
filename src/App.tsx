import { useEffect, useState } from 'react';
import { Board } from '@/components/Board/Board';
import { GameInfo } from '@/components/GameInfo/GameInfo';
import { SavedGamesDialog } from '@/components/SavedGamesDialog/SavedGamesDialog';
import { getNextPlayer } from '@/lib/constants';
import { saveGame } from '@/lib/savedGames';
import type { HistoryEntry, Player, SavedGame, Winner } from '@/lib/types';
import { Alert } from './components/Alert/Alert';
import RightPanel from './components/RightPanel/RightPanel';

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState<Player[]>(Array(boardSize * boardSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Winner>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);
  const [isViewingSavedGame, setIsViewingSavedGame] = useState(false);
  const [previousWinner, setPreviousWinner] = useState<Winner>(null);
  const [savedGamesRefreshKey, setSavedGamesRefreshKey] = useState(0);
  const [isSavedGamesDialogOpen, setIsSavedGamesDialogOpen] = useState(false);

  const isViewingHistory = currentHistoryIndex !== null;

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
    if (currentHistoryIndex !== null || isViewingSavedGame) return;

    if (board[index] || winner) return;
    const currentPlayer = getNextPlayer(isXNext);
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const gameWinner = checkWinner(newBoard, boardSize);

    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(gameWinner);

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
    setIsViewingSavedGame(false);
    setPreviousWinner(null);
  };

  const handleBoardSizeChange = (newSize: number) => {
    setBoardSize(newSize);
    setBoard(Array(newSize * newSize).fill(null));
    setIsXNext(true);
    setWinner(null);
    setHistory([]);
    setCurrentHistoryIndex(null);
    setIsViewingSavedGame(false);
    setPreviousWinner(null);
  };

  const handleHistoryClick = (index: number) => {
    const selectedState = history[index].gameState;
    setBoard(selectedState.board);
    setIsXNext(selectedState.isXNext);
    setWinner(selectedState.winner);
    setCurrentHistoryIndex(index);
  };

  const handleContinueGame = () => {
    if (isViewingSavedGame) {
      resetGame();
      return;
    }

    if (history.length > 0) {
      const lastState = history[history.length - 1].gameState;
      setBoard(lastState.board);
      setIsXNext(lastState.isXNext);
      setWinner(lastState.winner);
    }
    setCurrentHistoryIndex(null);
  };

  const handleLoadSavedGame = (game: SavedGame) => {
    setBoardSize(game.boardSize);
    setHistory(game.history);

    if (game.history.length > 0) {
      const finalState = game.history[game.history.length - 1].gameState;
      setBoard(finalState.board);
      setIsXNext(finalState.isXNext);
      setWinner(finalState.winner);
    } else {
      setBoard(Array(game.boardSize * game.boardSize).fill(null));
      setIsXNext(true);
      setWinner(game.winner);
    }

    setCurrentHistoryIndex(null);
    setIsViewingSavedGame(true);
  };

  useEffect(() => {
    if (winner && winner !== previousWinner && !isViewingSavedGame) {
      const gameToSave: SavedGame = {
        id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        boardSize,
        history,
        winner,
        timestamp: Date.now(),
      };
      saveGame(gameToSave);
      setSavedGamesRefreshKey((prev) => prev + 1);
    }
    setPreviousWinner(winner);
  }, [winner, boardSize, history, isViewingSavedGame, previousWinner]);

  return (
    <>
      <main className="flex h-full flex-col items-center gap-4 p-4 md:pr-56">
        <header className="flex w-full items-center justify-between pr-24">
          <h1>Tic Tac Toe Game</h1>
        </header>

        <div className="flex max-w-full grow flex-col items-center justify-center">
          <GameInfo winner={winner} isXNext={isXNext} />
          <Board
            board={board}
            boardSize={boardSize}
            winner={winner}
            highlightedPosition={isViewingHistory ? history[currentHistoryIndex]?.position : null}
            isViewingHistory={isViewingHistory || isViewingSavedGame}
            onSquareClick={handleClick}
          />
        </div>

        {isViewingHistory && !isViewingSavedGame && (
          <Alert
            button={{
              text: ' Continue Game',
              onClick: handleContinueGame,
              variant: 'primary',
            }}
            description="You are viewing a game history now"
          />
        )}

        {isViewingSavedGame && (
          <Alert
            button={{
              text: 'Exit Saved Game',
              onClick: handleContinueGame,
              variant: 'primary',
            }}
            description="You are viewing a saved game now"
          />
        )}
      </main>
      <RightPanel
        boardSize={boardSize}
        board={board}
        getWinLength={getWinLength}
        history={history}
        currentHistoryIndex={currentHistoryIndex}
        winner={winner}
        onBoardSizeChange={handleBoardSizeChange}
        onResetGame={resetGame}
        onHistoryClick={handleHistoryClick}
        onOpenSavedGames={() => {
          setIsSavedGamesDialogOpen(true);
        }}
      />
      <SavedGamesDialog
        isOpen={isSavedGamesDialogOpen}
        onClose={() => {
          setIsSavedGamesDialogOpen(false);
        }}
        onLoadGame={handleLoadSavedGame}
        refreshKey={savedGamesRefreshKey}
      />
    </>
  );
}

export default App;
