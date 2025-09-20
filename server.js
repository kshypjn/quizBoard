const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// In-memory storage for games by code
let games = {};

// Generate a random 6-digit game code
const generateGameCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get or create game by code
const getGame = (gameCode) => {
  if (!games[gameCode]) {
    games[gameCode] = {
      teams: [],
      gameState: {
        isGameActive: false,
        totalScore: 0
      }
    };
  }
  return games[gameCode];
};

// Routes

// Create a new game and get game code
app.post('/api/games', (req, res) => {
  const gameCode = generateGameCode();
  const game = getGame(gameCode);
  
  res.json({
    gameCode,
    message: 'Game created successfully'
  });
});

// Join existing game
app.post('/api/games/join', (req, res) => {
  const { gameCode } = req.body;
  
  if (!gameCode || gameCode.length !== 6) {
    return res.status(400).json({ error: 'Valid 6-digit game code is required' });
  }
  
  const game = getGame(gameCode);
  
  res.json({
    gameCode,
    teams: game.teams,
    gameState: game.gameState,
    totalScore: game.teams.reduce((sum, team) => sum + team.score, 0),
    message: 'Joined game successfully'
  });
});

// Get game data
app.get('/api/games/:gameCode', (req, res) => {
  const { gameCode } = req.params;
  const game = getGame(gameCode);
  
  res.json({
    gameCode,
    teams: game.teams,
    gameState: game.gameState,
    totalScore: game.teams.reduce((sum, team) => sum + team.score, 0)
  });
});

// Create teams for a specific game
app.post('/api/games/:gameCode/teams', (req, res) => {
  const { gameCode } = req.params;
  const { teamNames } = req.body;
  
  if (!Array.isArray(teamNames)) {
    return res.status(400).json({ error: 'Team names array is required' });
  }

  const game = getGame(gameCode);
  
  // Reset game state
  if (teamNames.length === 0) {
    game.teams = [];
  } else {
    game.teams = teamNames.map((name, index) => ({
      id: index + 1,
      name: name.trim(),
      score: 0
    }));
  }
  
  game.gameState.isGameActive = true;
  game.gameState.totalScore = 0;

  res.json({
    gameCode,
    teams: game.teams,
    gameState: game.gameState,
    totalScore: 0,
    message: teamNames.length === 0 ? 'Empty game started successfully' : 'Teams created successfully'
  });
});

// Update team score for a specific game
app.patch('/api/games/:gameCode/teams/:id/score', (req, res) => {
  const { gameCode, id } = req.params;
  const { points } = req.body;

  if (!points || typeof points !== 'number') {
    return res.status(400).json({ error: 'Points must be a number' });
  }

  const game = getGame(gameCode);
  const teamIndex = game.teams.findIndex(team => team.id === parseInt(id));
  
  if (teamIndex === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }

  game.teams[teamIndex].score += points;
  game.gameState.totalScore = game.teams.reduce((sum, team) => sum + team.score, 0);

  res.json({
    gameCode,
    teams: game.teams,
    gameState: game.gameState,
    totalScore: game.gameState.totalScore,
    updatedTeam: game.teams[teamIndex]
  });
});

// Reset game
app.post('/api/games/:gameCode/reset', (req, res) => {
  const { gameCode } = req.params;
  const game = getGame(gameCode);
  
  game.teams = [];
  game.gameState = {
    isGameActive: false,
    totalScore: 0
  };

  res.json({
    gameCode,
    teams: game.teams,
    gameState: game.gameState,
    totalScore: 0,
    message: 'Game reset successfully'
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
