import { Match } from "./types";

export const dataPathCasts: {
    [key in keyof Match]?: (value: string) => Match[key];
  } = {
    home_score: (value: string) => Number(value),
    away_score: (value: string) => Number(value),
    yellow_cards: (value: string) => Number(value),
  };
  
  export const columns = [
    "date",
    "home_team",
    "away_team",
    "home_score",
    "away_score",
    "yellow_cards",
  ];
  