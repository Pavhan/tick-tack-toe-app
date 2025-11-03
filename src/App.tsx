import { useState } from 'react';
import { Board, type Player, type Winner } from '@/components/Board/Board';
import { Button } from '@/components/Button/Button';
import { GameInfo } from '@/components/GameInfo/GameInfo';

function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Winner>(null);

  const checkWinner = (squares: Player[]): Winner => {
    // Check rows
    for (let row = 0; row < 3; row++) {
      const start = row * 3;
      if (squares[start] && squares[start] === squares[start + 1] && squares[start] === squares[start + 2]) {
        return squares[start];
      }
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      if (squares[col] && squares[col] === squares[col + 3] && squares[col] === squares[col + 6]) {
        return squares[col];
      }
    }
    // Check diagonals
    if (squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) {
      return squares[0];
    }
    if (squares[2] && squares[2] === squares[4] && squares[2] === squares[6]) {
      return squares[2];
    }
    // Check for draw
    if (squares.every((square) => square !== null)) {
      return 'Draw';
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <h1 className="text-4xl font-bold">Tic-Tac-Toe</h1>
      <GameInfo winner={winner} isXNext={isXNext} />
      <Board board={board} winner={winner} onSquareClick={handleClick} />
      <Button onClick={resetGame}>Reset Game</Button>
    </div>
  );
}

export default App;
