/**
 * Returns the input string if it is truthy, otherwise returns false.
 *
 * @param {string | undefined} str - The input string to be tested.
 * @returns {string | boolean} - If the input string is truthy, it is returned. Otherwise, false is returned.
 */
export function test(str?: string): string | boolean {
	if (!str) return false;
	return str;
}
