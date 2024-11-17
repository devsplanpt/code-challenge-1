export type Match = {
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  yellow_cards: number;
};


export type TeamWins = {
    team: string;
    wins: number;
}

export type Reporter = ((data: Match[]) => string)[]