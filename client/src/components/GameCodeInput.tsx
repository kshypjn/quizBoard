import React, { useState } from 'react';
import { quizApi } from '../services/api';

interface GameCodeInputProps {
  onGameJoined: (gameCode: string, role: 'host' | 'viewer') => void;
  onCreateGame: (gameCode: string) => void;
}

const GameCodeInput: React.FC<GameCodeInputProps> = ({ onGameJoined, onCreateGame }) => {
  const [gameCode, setGameCode] = useState<string>('');
  const [userRole, setUserRole] = useState<'host' | 'viewer'>('viewer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await quizApi.joinGame(gameCode);
      onGameJoined(gameCode, userRole);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join game. Please check the game code.');
      console.error('Error joining game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await quizApi.createGame();
      onCreateGame(response.gameCode);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      console.error('Error creating game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="game-code-input">
      <div className="game-code-header">
        <h2>🎯 Quiz Scoreboard</h2>
        <p>Enter a game code to join or create a new game</p>
      </div>

      <div className="game-code-options">
        <div className="join-game-section">
          <h3>Join Existing Game</h3>
          <form onSubmit={handleJoinGame} className="join-form">
            <div className="form-group">
              <label htmlFor="gameCode">Game Code:</label>
              <input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="game-code-input-field"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Role:</label>
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="host"
                    checked={userRole === 'host'}
                    onChange={(e) => setUserRole(e.target.value as 'host' | 'viewer')}
                  />
                  <span className="role-label">
                    🎯 Host (Can control scores)
                  </span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="viewer"
                    checked={userRole === 'viewer'}
                    onChange={(e) => setUserRole(e.target.value as 'host' | 'viewer')}
                  />
                  <span className="role-label">
                    👀 Viewer (Watch only)
                  </span>
                </label>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || gameCode.length !== 6}
              className="join-game-btn"
            >
              {isLoading ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="create-game-section">
          <h3>Create New Game</h3>
          <p>Start a new quiz game and share the code with others</p>
          <button 
            onClick={handleCreateGame}
            disabled={isLoading}
            className="create-game-btn"
          >
            {isLoading ? 'Creating...' : 'Create New Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCodeInput;
