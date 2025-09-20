import React, { useState } from 'react';
import { Team, GameState } from './types';
import { quizApi } from './services/api';
import GameCodeInput from './components/GameCodeInput';
import TeamSetup from './components/TeamSetup';
import Scoreboard from './components/Scoreboard';
import GameCodeDisplay from './components/GameCodeDisplay';
import './App.css';

function App() {
  const [gameCode, setGameCode] = useState<string>('');
  const [userRole, setUserRole] = useState<'host' | 'viewer'>('host');
  const [teams, setTeams] = useState<Team[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isGameActive: false,
    totalScore: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadGameState = async (currentGameCode: string) => {
    if (!currentGameCode) return;
    
    setIsLoading(true);
    try {
      const response = await quizApi.getGame(currentGameCode);
      setTeams(response.teams);
      setGameState(response.gameState);
    } catch (error) {
      console.error('Error loading game state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameJoined = (newGameCode: string, role: 'host' | 'viewer') => {
    setGameCode(newGameCode);
    setUserRole(role);
    loadGameState(newGameCode);
  };

  const handleGameCreated = (newGameCode: string) => {
    setGameCode(newGameCode);
    setUserRole('host'); // Creator is always the host
    setTeams([]);
    setGameState({
      isGameActive: false,
      totalScore: 0
    });
  };

  const handleTeamsCreated = async (teamNames: string[]) => {
    if (!gameCode) return;
    
    try {
      const response = await quizApi.createTeams(gameCode, teamNames);
      setTeams(response.teams);
      setGameState(response.gameState);
    } catch (error) {
      console.error('Error creating teams:', error);
    }
  };

  const handleScoreUpdate = async (updatedTeams?: Team[]) => {
    if (updatedTeams) {
      // Update teams directly without refetching
      setTeams(updatedTeams);
    } else if (gameCode) {
      // Fallback to full reload if no teams provided
      loadGameState(gameCode);
    }
  };

  const handleResetGame = async () => {
    if (!gameCode) return;
    
    try {
      await quizApi.resetGame(gameCode);
      setTeams([]);
      setGameState({
        isGameActive: false,
        totalScore: 0
      });
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const handleGameCodeChange = (newGameCode: string) => {
    setGameCode(newGameCode);
    if (newGameCode) {
      loadGameState(newGameCode);
    } else {
      setTeams([]);
      setGameState({
        isGameActive: false,
        totalScore: 0
      });
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Quiz Scoreboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Quiz Scoreboard</h1>
        <p>Track scores and celebrate victories!</p>
        {gameCode && (
          <GameCodeDisplay 
            gameCode={gameCode} 
            onGameCodeChange={handleGameCodeChange} 
          />
        )}
      </header>

      <main className="app-main">
        {!gameCode ? (
          <GameCodeInput 
            onGameJoined={handleGameJoined}
            onCreateGame={handleGameCreated}
          />
        ) : !gameState.isGameActive || teams.length === 0 ? (
          userRole === 'host' ? (
            <TeamSetup onTeamsCreated={handleTeamsCreated} />
          ) : (
            <div className="viewer-waiting">
              <div className="waiting-icon">⏳</div>
              <h3>Waiting for Host</h3>
              <p>The game host is setting up teams. Please wait...</p>
            </div>
          )
        ) : (
          <Scoreboard
            gameCode={gameCode}
            userRole={userRole}
            teams={teams}
            gameState={gameState}
            onScoreUpdate={handleScoreUpdate}
            onResetGame={handleResetGame}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ for quiz enthusiasts</p>
      </footer>
    </div>
  );
}

export default App;