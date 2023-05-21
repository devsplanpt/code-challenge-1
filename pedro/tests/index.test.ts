import { test } from '../src/index';

describe('index', () => {
	it('should test my custom function', () => {
		expect(test('HELLO')).toBe('HELLO');
	});

	it('should return a boolean when no string is provided', () => {
		expect(test()).toBe(false);
	});
});
