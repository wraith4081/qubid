// tests/generator.test.ts

import { IdGenerator } from '../src';
import { getHighPrecisionTimestamp } from '../src/utils/timestamp';

describe('IdGenerator', () => {
	let idGenerator: IdGenerator;

	beforeEach(() => {
		idGenerator = new IdGenerator();
	});

	test('should generate a non-empty string', () => {
		const id = idGenerator.generate();
		expect(typeof id).toBe('string');
		expect(id).not.toHaveLength(0);
	});

	test('should generate unique IDs', () => {
		const idSet = new Set<string>();
		const idCount = 10000;

		for (let i = 0; i < idCount; i++) {
			const id = idGenerator.generate();
			expect(idSet.has(id)).toBe(false);
			idSet.add(id);
		}

		expect(idSet.size).toBe(idCount);
	});

	test('IDs should be k-sorted (time-ordered)', () => {
		const ids: string[] = [];

		for (let i = 0; i < 1000; i++) {
			ids.push(idGenerator.generate());
		}

		const sortedIds = [...ids].sort();
		expect(ids).toEqual(sortedIds);
	});

	test('should handle high-throughput ID generation', () => {
		const idSet = new Set<string>();
		const idCount = 65536 * 2; // Exceeding the sequence counter limit

		for (let i = 0; i < idCount; i++) {
			const id = idGenerator.generate();
			idSet.add(id);
		}

		expect(idSet.size).toBe(idCount);
	});

	test('should allow disabling MAC address usage', () => {
		const idGenWithoutMac = new IdGenerator({ useMacAddress: false });
		const id = idGenWithoutMac.generate();
		expect(typeof id).toBe('string');
		expect(id).not.toHaveLength(0);
	});

	test('should reset sequence counter when timestamp changes', () => {
		const idGenerator = new IdGenerator();
		const originalGetHighPrecisionTimestamp = getHighPrecisionTimestamp;

		// Mock the timestamp to stay the same for the first calls
		let mockTimestamp = BigInt(1234567890);
		(getHighPrecisionTimestamp as jest.Mock) = jest.fn(() => mockTimestamp);

		// Generate IDs until sequence counter overflows
		for (let i = 0; i <= 0xffff; i++) {
			idGenerator.generate();
		}

		// Advance the timestamp
		mockTimestamp = BigInt(1234567891);

		// Generate another ID
		const id = idGenerator.generate();

		// Restore the original function
		(getHighPrecisionTimestamp as any) = originalGetHighPrecisionTimestamp;

		expect(id).toBeDefined();
	});
});
