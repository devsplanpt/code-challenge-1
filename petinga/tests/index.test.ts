import { getChampionshipData } from "../src/parse";
import {
  computeAvgGoalsPerMatch,
  computeAvgYellowCardsPerMatch,
  computeTeamWithLeastWins,
  computeTeamWithMostWins,
} from "../src/metrics";
import { computeReport } from "../src/report";
import { fullReport } from "../src/reporters";
import { Match } from "../src/types";
import { logChampionshipReport } from "../src";

describe("index", () => {
  describe("read file and parse data", () => {
    it("should read CSV file and return data as an array of objects", async () => {
      const expected: Match[] = [
        {
          date: "2023-01-01",
          home_team: "Team A",
          away_team: "Team B",
          home_score: 2,
          away_score: 1,
          yellow_cards: 3,
        },
        {
          date: "2023-01-02",
          home_team: "Team A",
          away_team: "Team D",
          home_score: 3,
          away_score: 5,
          yellow_cards: 2,
        },
      ];

      const actual = await getChampionshipData(
        `${__dirname}/fixtures/data.csv`
      );

      expect(actual).toEqual(expected);
    });

    test("should handle read file error gracefully", async () => {
      await expect(
        getChampionshipData(`invalid-path/data.csv`)
      ).rejects.toThrow("unable to read file");
    });

    test("should return empty array if file doesnt have any data", async () => {
      const expected: Match[] = [];

      const actual = await getChampionshipData(
        `${__dirname}/fixtures/no-data.csv`
      );

      expect(actual).toEqual(expected);
    });

    test("if file is empty throws error", async () => {
      await expect(
        getChampionshipData(`${__dirname}/fixtures/empty.csv`)
      ).rejects.toThrow("empty file");
    });

    test("should throw if header is not valid", async () => {
      await expect(
        getChampionshipData(`${__dirname}/fixtures/invalid-header.csv`)
      ).rejects.toThrow("invalid header");
    });
  });

  describe("compute metrics", () => {
    test("computes avg goals per match", () => {
      const data: Match[] = [
        {
          date: "2023-01-01",
          home_team: "Team A",
          away_team: "Team B",
          home_score: 2,
          away_score: 1,
          yellow_cards: 3,
        },
        {
          date: "2023-01-02",
          home_team: "Team A",
          away_team: "Team D",
          home_score: 3,
          away_score: 5,
          yellow_cards: 2,
        },
      ];
      const totalGames = 2;
      const totalGoals = 11;
	  const expected = (totalGoals / totalGames).toFixed(2);

      const actual = computeAvgGoalsPerMatch(data);

      expect(actual).toEqual(expected);
    });

    test.each([
      {
        data: [
          {
            date: "2023-01-01",
            home_team: "Team A",
            away_team: "Team B",
            home_score: 2,
            away_score: 1,
            yellow_cards: 3,
          },
          {
            date: "2023-01-02",
            home_team: "Team A",
            away_team: "Team D",
            home_score: 5,
            away_score: 3,
            yellow_cards: 2,
          },
          {
            date: "2023-01-02",
            home_team: "Team B",
            away_team: "Team D",
            home_score: 5,
            away_score: 3,
            yellow_cards: 2,
          },
        ],
        mostWins: "Team A",
        totalWins: 2,
      },
      {
        data: [
          {
            date: "2023-01-01",
            home_team: "Team A",
            away_team: "Team B",
            home_score: 2,
            away_score: 4,
            yellow_cards: 3,
          },
          {
            date: "2023-01-02",
            home_team: "Team A",
            away_team: "Team D",
            home_score: 5,
            away_score: 3,
            yellow_cards: 2,
          },
          {
            date: "2023-01-02",
            home_team: "Team B",
            away_team: "Team D",
            home_score: 5,
            away_score: 3,
            yellow_cards: 2,
          },
        ],
        mostWins: "Team B",
        totalWins: 2,
      },
      {
        data: [
          {
            date: "2023-01-01",
            home_team: "Team D",
            away_team: "Team B",
            home_score: 5,
            away_score: 1,
            yellow_cards: 3,
          },
          {
            date: "2023-01-02",
            home_team: "Team A",
            away_team: "Team D",
            home_score: 1,
            away_score: 8,
            yellow_cards: 2,
          },
          {
            date: "2023-01-02",
            home_team: "Team B",
            away_team: "Team D",
            home_score: 1,
            away_score: 8,
            yellow_cards: 2,
          },
        ],
        mostWins: "Team D",
        totalWins: 3,
      },
    ])(
      "computes team $mostWins as the team with most wins because they won $totalWins times",
      ({ data, mostWins, totalWins }) => {
        const expected = {
          team: mostWins,
          wins: totalWins,
        };

        const actual = computeTeamWithMostWins(data);

        expect(actual).toEqual(expected);
      }
    );

    test("computes team with least wins", () => {
      const data: Match[] = [
        {
          date: "2023-01-01",
          home_team: "Team A",
          away_team: "Team B",
          home_score: 2,
          away_score: 1,
          yellow_cards: 3,
        },
        {
          date: "2023-01-02",
          home_team: "Team A",
          away_team: "Team D",
          home_score: 5,
          away_score: 3,
          yellow_cards: 2,
        },
        {
          date: "2023-01-02",
          home_team: "Team B",
          away_team: "Team D",
          home_score: 5,
          away_score: 3,
          yellow_cards: 2,
        },
      ];
      const expected = {
        team: "Team D",
        wins: 0,
      };

      const actual = computeTeamWithLeastWins(data);

      expect(actual).toEqual(expected);
    });

	test('computes avg yellow cards per match', () => {
		const data: Match[] = [
			{
			  date: "2023-01-01",
			  home_team: "Team A",
			  away_team: "Team B",
			  home_score: 2,
			  away_score: 1,
			  yellow_cards: 3,
			},
			{
			  date: "2023-01-02",
			  home_team: "Team A",
			  away_team: "Team D",
			  home_score: 5,
			  away_score: 3,
			  yellow_cards: 2,
			},
			{
			  date: "2023-01-02",
			  home_team: "Team B",
			  away_team: "Team D",
			  home_score: 5,
			  away_score: 3,
			  yellow_cards: 2,
			},
		  ];

		  const totalGames = data.length
		  const totalYellowCards = 7
		  const expected = (totalYellowCards / totalGames).toFixed(2)


		  const actual = computeAvgYellowCardsPerMatch(data)

		  expect(actual).toEqual(expected)
	})

	test('computes report correctly', async () => {
		const data: Match[] = [
			{
			  date: "2023-01-01",
			  home_team: "Team A",
			  away_team: "Team B",
			  home_score: 2,
			  away_score: 1,
			  yellow_cards: 3,
			},
			{
			  date: "2023-01-02",
			  home_team: "Team A",
			  away_team: "Team D",
			  home_score: 5,
			  away_score: 3,
			  yellow_cards: 2,
			},
			{
			  date: "2023-01-02",
			  home_team: "Team B",
			  away_team: "Team D",
			  home_score: 5,
			  away_score: 3,
			  yellow_cards: 2,
			},
		  ];

		const expected = `Avg. goals per match: 6.33\nTeam with most wins: Team A with 2 wins\nTeam with least wins: Team D with 0 wins\nAvg. yellow cards per match: 2.33`

		const actual = await computeReport(data, fullReport)

		expect(actual).toEqual(expected)
	})

	test('logs report correctly', async () => {
		const expected = `Avg. goals per match: 5.50\nTeam with most wins: Team A with 1 wins\nTeam with least wins: Team B with 0 wins\nAvg. yellow cards per match: 2.50`

		const actual = await logChampionshipReport(`${__dirname}/fixtures/data.csv`, fullReport)

		expect(actual).toEqual(expected)
	})
  });
});
