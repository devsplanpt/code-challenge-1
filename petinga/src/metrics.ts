import { Match, TeamWins } from "./types";

export const computeAvgGoalsPerMatch = (data: Match[]) => {
  const totalGoals = data.reduce((total, match) => {
    return total + match.home_score + match.away_score;
  }, 0);

  const avgGoals = totalGoals / data.length;

  return avgGoals.toFixed(2);
};

export const computeTeamWithMostWins = (data: Match[]): TeamWins => {
  const winsPerTeam = getOrderedTeamsByWins(data);

  const [team, wins] = Object.entries(winsPerTeam).at(0)!;

  return {
    team,
    wins,
  };
};

export const computeTeamWithLeastWins = (data: Match[]): TeamWins => {
  const winsPerTeam = getOrderedTeamsByWins(data, "asc");

  const [team, wins] = Object.entries(winsPerTeam)[0];

  return {
    team,
    wins,
  };
};

export const computeAvgYellowCardsPerMatch = (data: Match[]) => {
  const totalYellowCards = data.reduce((total, match) => {
    return total + match.yellow_cards;
  }, 0);

  const avgYellowCards = totalYellowCards / data.length;

  return avgYellowCards.toFixed(2);
};

const getOrderedTeamsByWins = (
  data: Match[],
  orderBy: "asc" | "desc" = "desc"
) => {
  const winsPerTeam = data.reduce((acc, match) => {
    const { home_team, away_team, home_score, away_score } = match;

    const homeTeamWon = home_score > away_score;
    const awayTeamWon = away_score > home_score;

    if (homeTeamWon) {
      acc[home_team] = acc[home_team] ? acc[home_team] + 1 : 1;
      acc[away_team] ||= 0;
    }

    if (awayTeamWon) {
      acc[away_team] = acc[away_team] ? acc[away_team] + 1 : 1;
      acc[home_team] ||= 0;
    }

    return acc;
  }, {} as Record<string, number>);

  return sortTeamsByWins(winsPerTeam, orderBy);
};

const sortTeamsByWins = (
  winsPerTeam: Record<string, number>,
  orderBy: "asc" | "desc"
) => {
  const orderedWinsPerTeam = Object.entries(winsPerTeam)
    .sort(([, teamAWins], [, teamBWins]) => {
      if (orderBy === "asc") {
        return teamAWins - teamBWins;
      } else {
        return teamBWins - teamAWins;
      }
    })
    .reduce((acc, [team, wins]) => {
      acc[team] = wins;
      return acc;
    }, {} as Record<string, number>);

  return orderedWinsPerTeam;
};
