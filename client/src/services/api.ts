import axios from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  // Create a new game
  createGame: async (): Promise<{ gameCode: string; message: string }> => {
    const response = await api.post('/games');
    return response.data;
  },

  // Join existing game
  joinGame: async (gameCode: string): Promise<ApiResponse> => {
    const response = await api.post('/games/join', { gameCode });
    return response.data;
  },

  // Get game data
  getGame: async (gameCode: string): Promise<ApiResponse> => {
    const response = await api.get(`/games/${gameCode}`);
    return response.data;
  },

  // Create teams for a game
  createTeams: async (gameCode: string, teamNames: string[]): Promise<ApiResponse> => {
    const response = await api.post(`/games/${gameCode}/teams`, { teamNames });
    return response.data;
  },

  // Update team score
  updateTeamScore: async (gameCode: string, teamId: number, points: number): Promise<ApiResponse> => {
    const response = await api.patch(`/games/${gameCode}/teams/${teamId}/score`, { points });
    return response.data;
  },

  // Reset game
  resetGame: async (gameCode: string): Promise<ApiResponse> => {
    const response = await api.post(`/games/${gameCode}/reset`);
    return response.data;
  },
};
