import { computeAvgGoalsPerMatch, computeAvgYellowCardsPerMatch, computeTeamWithLeastWins, computeTeamWithMostWins } from "./metrics";
import { Match, Reporter } from "./types";



export const computeReport = (data: Match[], reporter: Reporter) => {
    const reportLines: string[] = reporter.map(reporter => reporter(data));

    return reportLines.join("\n");
}