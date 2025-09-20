import React, { useState } from 'react';

interface GameCodeDisplayProps {
  gameCode: string;
  onGameCodeChange: (newGameCode: string) => void;
}

const GameCodeDisplay: React.FC<GameCodeDisplayProps> = ({ gameCode, onGameCodeChange }) => {
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy game code:', err);
    }
  };

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? This will end the current game.')) {
      onGameCodeChange('');
    }
  };

  return (
    <div className="game-code-display">
      <div className="game-code-info">
        <div className="game-code-label">Game Code:</div>
        <div className="game-code-value" onClick={() => setShowCode(!showCode)}>
          {showCode ? gameCode : '••••••'}
        </div>
        <button 
          onClick={copyToClipboard}
          className="copy-btn"
          title="Copy game code"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      
      <div className="game-code-actions">
        <button 
          onClick={() => setShowCode(!showCode)}
          className="toggle-btn"
        >
          {showCode ? 'Hide' : 'Show'} Code
        </button>
        <button 
          onClick={handleNewGame}
          className="new-game-btn"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameCodeDisplay;
