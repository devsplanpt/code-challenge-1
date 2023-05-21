import fs from 'fs';
import {
	readCSVFile,
	bestAverageGoalsPerGame,
	getRowsFromCSVFile,
	getDataFromCSVFile,
	doesJSONFileExist,
} from '../src/index';
import { MatchData } from '../types';

describe('Championships test cases', () => {
	describe('readCSVFile', () => {
		it('should return the content of the specific CSV file', () => {
			const filePath = 'test.csv';
			const expectedContent =
				'Name, Age, City\nJohn, 23, New York\nJane, 30, Los Angeles\n';
			fs.writeFileSync(filePath, expectedContent);
			expect(readCSVFile(filePath)).toEqual(expectedContent);
			fs.unlinkSync(filePath);
		});

		it('should throw an error if the file does not exist', () => {
			expect(() => readCSVFile('nonexistent.csv')).toThrowError();
		});
	});

	describe('getRowsFromCSVFile', () => {
		it('should return the content of the specific CSV file', () => {
			const filePath = 'test.csv';
			const expectedContent =
				'Name, Age, City\nJohn, 23, New York\nJane, 30, Los Angeles\n';
			fs.writeFileSync(filePath, expectedContent);
			const expectedRows = [
				'Name, Age, City',
				'John, 23, New York',
				'Jane, 30, Los Angeles',
				'',
			];
			expect(getRowsFromCSVFile(filePath)).toEqual(expectedRows);
			fs.unlinkSync(filePath);
		});

		it('throws an error if the file does not exist', () => {
			expect(() => getRowsFromCSVFile('nonexistent.csv')).toThrowError();
		});
	});

	describe('getDataFromCSVFile', () => {
		it('returns a 2D array of strings representing the data in the CSV file', () => {
			const filePath = 'test.csv';
			const expectedContent =
				'Name, Age, City\nJohn, 23, New York\nJane, 30, Los Angeles\n';
			fs.writeFileSync(filePath, expectedContent);
			const expectedData = [
				['Name', ' Age', ' City'],
				['John', ' 23', ' New York'],
				['Jane', ' 30', ' Los Angeles'],
				[''],
			];
			expect(getDataFromCSVFile(filePath)).toEqual(expectedData);
			fs.unlinkSync(filePath);
		});

		it('throws an error if the file does not exist', () => {
			expect(() => getDataFromCSVFile('nonexistent.csv')).toThrowError();
		});
	});

	describe('doesJSONFileExist', () => {
		it('should return true when file exists', () => {
			const filePath = 'path/to/existing/file.json';
			jest.spyOn(fs, 'existsSync').mockReturnValue(true);

			const result = doesJSONFileExist(filePath);

			expect(result).toBe(true);
		});

		it('should return false when file does not exist', () => {
			const filePath = 'path/to/nonexistent/file.json';
			jest.spyOn(fs, 'existsSync').mockReturnValue(false);

			const result = doesJSONFileExist(filePath);

			expect(result).toBe(false);
		});
	});

	describe('bestAverageGoalsPerGame', () => {
		it('should return the best team', () => {
			const matches: MatchData[] = [
				{
					date: '2023-01-05',
					home_team: 'Team A',
					away_team: 'Team C',
					home_score: '2',
					away_score: '0',
					yellow_cards: '2',
				},
				{
					date: '2023-01-06',
					home_team: 'Team D',
					away_team: 'Team B',
					home_score: '1',
					away_score: '1',
					yellow_cards: '3',
				},
				{
					date: '2023-01-07',
					home_team: 'Team E',
					away_team: 'Team F',
					home_score: '2',
					away_score: '3',
					yellow_cards: '2',
				},
			];
			expect(bestAverageGoalsPerGame(matches)).toEqual(
				'Team: Team F - Average Goals: 3'
			);
		});
	});
});
