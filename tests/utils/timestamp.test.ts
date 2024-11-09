import { getHighPrecisionTimestamp } from '../../src/utils/timestamp';

describe('getHighPrecisionTimestamp', () => {
	test('should return a bigint', () => {
		const timestamp = getHighPrecisionTimestamp();
		expect(typeof timestamp).toBe('bigint');
	});

	test('should return increasing timestamps', () => {
		const timestamp1 = getHighPrecisionTimestamp();
		const timestamp2 = getHighPrecisionTimestamp();
		expect(timestamp2 >= timestamp1).toBe(true);
	});
});
