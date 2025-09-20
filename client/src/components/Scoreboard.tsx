import React, { useState } from 'react';
import { Team, GameState } from '../types';
import { quizApi } from '../services/api';

interface ScoreboardProps {
  gameCode: string;
  userRole: 'host' | 'viewer';
  teams: Team[];
  gameState: GameState;
  onScoreUpdate: () => void;
  onResetGame: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  gameCode,
  userRole,
  teams,
  gameState,
  onScoreUpdate,
  onResetGame
}) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [customPoints, setCustomPoints] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateScore = async (teamId: number, points: number) => {
    setIsLoading(true);
    try {
      await quizApi.updateTeamScore(gameCode, teamId, points);
      onScoreUpdate();
    } catch (error) {
      console.error('Error updating score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomPoints = async () => {
    if (!selectedTeam || !customPoints) return;
    
    const points = parseInt(customPoints);
    if (isNaN(points)) return;
    
    await updateScore(selectedTeam, points);
    setCustomPoints('');
  };

  // Get teams grouped by score for badges (handling ties)
  const getTeamBadge = (team: Team) => {
    if (teams.length === 0) return null;
    
    // Sort teams by score (highest first)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    
    // Find the score of the current team
    const currentTeamScore = team.score;
    
    // Find all teams with the same score as current team
    const teamsWithSameScore = sortedTeams.filter(t => t.score === currentTeamScore);
    
    // Find the first occurrence of this score in the sorted list
    const firstOccurrenceIndex = sortedTeams.findIndex(t => t.score === currentTeamScore);
    
    // Determine medal based on position (handling ties)
    if (firstOccurrenceIndex === 0) {
      // First place (could be tied)
      return '🥇';
    } else if (firstOccurrenceIndex === 1) {
      // Second place (could be tied)
      return '🥈';
    } else if (firstOccurrenceIndex === 2) {
      // Third place (could be tied)
      return '🥉';
    }
    
    return null;
  };

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>🏆 Quiz Scoreboard</h2>
        {userRole === 'host' && (
          <button onClick={onResetGame} className="reset-btn">
            🔄 Reset Game
          </button>
        )}
        {userRole === 'viewer' && (
          <div className="viewer-indicator">
            👀 Viewing Mode
          </div>
        )}
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No Teams Yet</h3>
          <p>Start by adding some teams to begin scoring!</p>
          <button onClick={onResetGame} className="add-teams-btn">
            Add Teams
          </button>
        </div>
      ) : (
        <div className="teams-container">
          {teams.map((team, index) => {
            const badge = getTeamBadge(team);
            return (
          <div key={team.id} className={`team-card ${badge ? 'leader' : ''}`}>
            <div className="team-rank">
              {badge || `#${index + 1}`}
            </div>
            <div className="team-info">
              <h3 className="team-name">{team.name}</h3>
              <div className="team-score">{team.score}</div>
            </div>
            
            {userRole === 'host' && (
              <div className="score-controls">
                <div className="quick-actions">
                  <button 
                    onClick={() => updateScore(team.id, 10)}
                    disabled={isLoading}
                    className="score-btn correct"
                    title="Correct Answer (+10)"
                  >
                    ✓ +10
                  </button>
                  <button 
                    onClick={() => updateScore(team.id, -10)}
                    disabled={isLoading}
                    className="score-btn incorrect"
                    title="Wrong Answer (-10)"
                  >
                    ✗ -10
                  </button>
                </div>
                
                {selectedTeam === team.id ? (
                <div className="custom-score-panel">
                  <div className="custom-score-inputs">
                    <input
                      type="number"
                      value={customPoints}
                      onChange={(e) => setCustomPoints(e.target.value)}
                      placeholder="5"
                      className="custom-points-input"
                    />
                    <button 
                      onClick={handleCustomPoints}
                      disabled={!customPoints || isLoading}
                      className="apply-points-btn"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={() => setSelectedTeam(null)}
                      className="close-custom-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="quick-custom-points">
                    {[-5, -2, 5, 15, 20].map(points => (
                      <button
                        key={points}
                        onClick={() => updateScore(selectedTeam, points)}
                        disabled={isLoading}
                        className={`quick-points-btn ${points > 0 ? 'positive' : 'negative'}`}
                      >
                        {points > 0 ? '+' : ''}{points}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="custom-score">
                  <button 
                    onClick={() => {
                      setSelectedTeam(team.id);
                      setCustomPoints('5');
                    }}
                    className="select-team-btn"
                  >
                    Custom
                  </button>
                </div>
              )}
              </div>
            )}
          </div>
          );
          })}
        </div>
      )}

    </div>
  );
};

export default Scoreboard;
