import { useEffect, useState } from 'react';
import { AlertSection } from '@/components/Alert';
import Board from '@/components/Board';
import GameInfo from '@/components/GameInfo';
import PageHeader from '@/components/PageHeader';
import RightPanel from '@/components/RightPanel';
import SavedGamesDialog from '@/components/SavedGamesDialog';
import { getNextPlayer } from '@/lib/constants';
import { checkWinner, getWinLength } from '@/lib/gameLogic';
import { saveGame } from '@/lib/savedGames';
import type { HistoryEntry, Player, SavedGame, Winner } from '@/lib/types';

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

  useEffect(() => {
    if (winner && winner !== previousWinner && !isViewingSavedGame) {
      const gameToSave: SavedGame = {
        id: `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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

  const handleOpenSavedGames = () => {
    setIsSavedGamesDialogOpen(true);
  };

  const handleCloseSavedGames = () => {
    setIsSavedGamesDialogOpen(false);
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

  return (
    <>
      <main className="flex h-full flex-col items-center gap-4 p-4 md:pr-56">
        <PageHeader />

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

        <AlertSection
          isViewingHistory={isViewingHistory}
          isViewingSavedGame={isViewingSavedGame}
          handleContinueGame={handleContinueGame}
        />
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
        onOpenSavedGames={handleOpenSavedGames}
      />
      <SavedGamesDialog
        isOpen={isSavedGamesDialogOpen}
        onClose={handleCloseSavedGames}
        onLoadGame={handleLoadSavedGame}
        refreshKey={savedGamesRefreshKey}
      />
    </>
  );
}

export default App;
