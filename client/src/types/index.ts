export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface GameState {
  isGameActive: boolean;
  totalScore: number;
}

export interface ApiResponse {
  gameCode?: string;
  teams: Team[];
  gameState: GameState;
  totalScore: number;
  message?: string;
  updatedTeam?: Team;
}
