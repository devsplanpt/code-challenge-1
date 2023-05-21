import fs from 'fs';
import { MatchData } from '../types';

const readCSVFile = (filePath: string): string => {
	return fs.readFileSync(filePath, 'utf-8');
};

const getRowsFromCSVFile = (filePath: string): string[] => {
	const csvData = readCSVFile(filePath);
	return csvData.split('\n');
};

const getDataFromCSVFile = (filePath: string): string[][] => {
	const rows = getRowsFromCSVFile(filePath);
	return rows.map((row) => row.split(','));
};

const doesJSONFileExist = (filePath: string): boolean => {
	return fs.existsSync(filePath);
};

const transformCSVToJSON = (rows: string[][]): MatchData[] =>
	//@ts-ignore
	rows.map((row: string[]) =>
		Object.fromEntries(
			headers.map((header: string, index: number) => [header, row[index]])
		)
	);

const csvFilePath = '../championship-data.csv';
const jsonFilePath = 'championship-data.json';

const csvData: string[][] = getDataFromCSVFile(csvFilePath);
const [headers, ...rows]: string[][] = csvData;

const jsonData: MatchData[] = transformCSVToJSON(rows);

if (!doesJSONFileExist(jsonFilePath)) {
	fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
}

// bestAverageGoalsPerGame

const updateTeamStats = (
	teams: Record<string, { goals: number; games: number }>,
	teamName: string,
	score: string
) => {
	if (teams[teamName]) {
		teams[teamName].goals += parseInt(score);
		teams[teamName].games++;
	} else {
		teams[teamName] = { goals: parseInt(score), games: 1 };
	}
};

const getBestTeam = (
	teams: Record<string, { goals: number; games: number }>
): { team: string; average: number } => {
	let bestTeam = '';
	let bestAverage = 0;
	for (const team in teams) {
		const average = teams[team].goals / teams[team].games;
		if (average > bestAverage) {
			bestTeam = team;
			bestAverage = Math.round(average);
		}
	}
	return {
		team: bestTeam,
		average: bestAverage,
	};
};

const bestAverageGoalsPerGame = (matches: MatchData[]): string => {
	const teams: Record<string, { goals: number; games: number }> = {};

	for (const match of matches) {
		const { home_team, home_score, away_team, away_score } = match;
		// Update home team stats
		updateTeamStats(teams, home_team, home_score);

		// Update away team stats
		updateTeamStats(teams, away_team, away_score);
	}

	const { team, average } = getBestTeam(teams);
	return `Team: ${team} - Average Goals: ${average}`;
};

console.log(bestAverageGoalsPerGame(jsonData));

const homeWins: MatchData[] = jsonData.filter(
	(game: MatchData) => parseInt(game.home_score) > parseInt(game.away_score)
);

const awayWins: MatchData[] = jsonData.filter(
	(game: MatchData) => parseInt(game.home_score) < parseInt(game.away_score)
);

const homeWinsByTeam = homeWins.reduce((acc, game) => {
	if (!acc[game.home_team]) {
		acc[game.home_team] = 0;
	}
	acc[game.home_team]++;
	return acc;
}, {});

const awayWinsByTeam = awayWins.reduce((acc, game) => {
	if (!acc[game.away_team]) {
		acc[game.away_team] = 0;
	}
	acc[game.away_team]++;
	return acc;
}, {});

const getAllTeams = (): string[] => [
	...new Set([...Object.keys(homeWinsByTeam), ...Object.keys(awayWinsByTeam)]),
];

const getTeamWithMostWins = (): string => {
	let maxWins = 0;
	let teamWithMostWins = '';
	for (const team of getAllTeams()) {
		const wins =
			parseInt(homeWinsByTeam[team]) + parseInt(awayWinsByTeam[team]);
		if (wins > maxWins) {
			maxWins = wins;
			teamWithMostWins = team;
		}
	}

	return `The team with the most wins is: ${teamWithMostWins} with ${maxWins} wins`;
};

console.log(getTeamWithMostWins());

export {
	readCSVFile,
	getRowsFromCSVFile,
	getDataFromCSVFile,
	doesJSONFileExist,
	transformCSVToJSON,
	csvFilePath,
	jsonFilePath,
	bestAverageGoalsPerGame,
};
