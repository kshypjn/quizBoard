import React, { useState } from 'react';

interface TeamSetupProps {
  onTeamsCreated: (teamNames: string[]) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onTeamsCreated }) => {
  const [numTeams, setNumTeams] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleNumTeamsChange = (value: number) => {
    if (value < 0 || value > 10) return;
    
    setNumTeams(value);
    const newTeamNames = Array(value).fill('').map((_, index) => 
      teamNames[index] || `Team ${index + 1}`
    );
    setTeamNames(newTeamNames);
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (numTeams === 0) {
        onTeamsCreated([]);
      } else {
        const validTeamNames = teamNames.map((name, index) => 
          name.trim() || `Team ${index + 1}`
        );
        onTeamsCreated(validTeamNames);
      }
    } catch (err) {
      setError('Failed to create teams. Please try again.');
      console.error('Error creating teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="team-setup">
      <div className="setup-header">
        <h2>🏆 Quiz Scoreboard Setup</h2>
        <p>Set up your teams and start the quiz!</p>
      </div>

      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label htmlFor="numTeams">Number of Teams:</label>
          <div className="number-input-group">
            <button 
              type="button" 
              onClick={() => handleNumTeamsChange(numTeams - 1)}
              disabled={numTeams <= 0}
              className="number-btn"
            >
              −
            </button>
            <input
              id="numTeams"
              type="number"
              min="0"
              max="10"
              value={numTeams}
              onChange={(e) => handleNumTeamsChange(parseInt(e.target.value))}
              className="number-input"
            />
            <button 
              type="button" 
              onClick={() => handleNumTeamsChange(numTeams + 1)}
              disabled={numTeams >= 10}
              className="number-btn"
            >
              +
            </button>
          </div>
        </div>

        {numTeams > 0 && (
          <div className="form-group">
            <label>Team Names:</label>
            <div className="team-names">
              {teamNames.map((name, index) => (
                <div key={index} className="team-name-input">
                  <label htmlFor={`team-${index}`}>Team {index + 1}:</label>
                  <input
                    id={`team-${index}`}
                    type="text"
                    value={name}
                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                    placeholder={`Team ${index + 1}`}
                    className="team-input"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="start-game-btn"
        >
          {isLoading ? 'Setting up...' : numTeams === 0 ? 'Start Empty Game' : 'Start Quiz Game!'}
        </button>
      </form>
    </div>
  );
};

export default TeamSetup;
