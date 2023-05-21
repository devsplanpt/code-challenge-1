import { computeAvgGoalsPerMatch, computeTeamWithMostWins, computeTeamWithLeastWins, computeAvgYellowCardsPerMatch } from "../metrics";
import { Reporter, Match } from "../types";

export const fullReport: Reporter = [
    (data: Match[]) => `Avg. goals per match: ${computeAvgGoalsPerMatch(data)}`,
    (data: Match[]) => {
        const teamWithMostWins = computeTeamWithMostWins(data);
        return `Team with most wins: ${teamWithMostWins.team} with ${teamWithMostWins.wins} wins`
    },
    (data: Match[]) => {
        const teamWithMostWins = computeTeamWithLeastWins(data);
        return `Team with least wins: ${teamWithMostWins.team} with ${teamWithMostWins.wins} wins`
    },
    (data: Match[]) => `Avg. yellow cards per match: ${computeAvgYellowCardsPerMatch(data)}`
]