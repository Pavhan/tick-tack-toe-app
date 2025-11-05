# Tic-Tac-Toe Game

A feature-rich, modern Tic-Tac-Toe game built with React, TypeScript, and Tailwind CSS. This project was created as an onboarding app for Foxmedia company.

## ✨ Features

### 🎮 Game Modes

- **Classic 3x3 board** - Traditional tic-tac-toe
- **Extended boards** - Play on boards from 3x3 up to 10x10
- **Dynamic win conditions** - Win requirements adapt to board size:
  - 3x3 board: 3 in a row
  - 4x4 board: 4 in a row
  - 5x5+ boards: 5 in a row

### 📜 Game History

- **Move history tracking** - Review every move made during the game
- **Time travel** - Jump back to any previous move to see the board state
- **Visual indicators** - Highlighted cells show the selected move in history

### 💾 Save & Load

- **Auto-save completed games** - Winning games are automatically saved to local storage
- **Browse saved games** - View all previously played games with timestamps
- **Load saved games** - Continue from where you left off or review past matches
- **Delete saved games** - Remove individual games or clear all at once

## 🛠️ Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe code for better development experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **LocalStorage** - Persistent game saves

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Pavhan/tick-tack-toe-app.git

# Navigate to the project directory
cd tick-tack-toe-app

# Install dependencies
npm install
```

## 🚀 Usage

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎯 How to Play

1. **Choose your board size** - Select from 3x3 to 10x10 in the right panel
2. **Make your move** - Click on any empty square to place your mark (X or O)
3. **Win the game** - Get the required number of marks in a row (horizontally, vertically, or diagonally)
4. **Review history** - Click on any move in the history panel to see that game state
5. **Continue playing** - Click "Continue Game" to return to the current game state
6. **Start fresh** - Use the "Reset Game" button to begin a new game
7. **Load saved games** - Access your previously won games from the "Saved Games" dialog

```




## 📝 License

This is a private project.

## 👤 Author

Pavel Hanys (@Pavhan)
```
