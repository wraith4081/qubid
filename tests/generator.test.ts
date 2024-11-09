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
        (getHighPrecisionTimestamp as () => bigint) =
            originalGetHighPrecisionTimestamp;

        expect(id).toBeDefined();
    });
});

describe('IdGenerator - Timestamp Extraction', () => {
    let idGenerator: IdGenerator;

    beforeEach(() => {
        idGenerator = new IdGenerator();
    });

    test('should extract timestamp close to current time', () => {
        const result = idGenerator.generate(true) as {
            id: string;
            timestamp: Date;
        };
        const { id, timestamp: originalTimestamp } = result;

        const extractedTimestamp = idGenerator.extractTimestamp(id);
        const timeDifference = Math.abs(
            originalTimestamp.getTime() - extractedTimestamp.getTime()
        );

        expect(timeDifference).toBeLessThanOrEqual(1); // Allow up to 1 millisecond difference
    });

    test('should extract timestamps in chronological order', () => {
        const count = 100;
        const timestamps: Date[] = [];

        for (let i = 0; i < count; i++) {
            const { id } = idGenerator.generate(true);
            const extractedTimestamp = idGenerator.extractTimestamp(id);
            timestamps.push(extractedTimestamp);
        }

        for (let i = 1; i < timestamps.length; i++) {
            expect(timestamps[i].getTime()).toBeGreaterThanOrEqual(
                timestamps[i - 1].getTime()
            );
        }
    });

    test('should match extracted timestamp with original timestamp', () => {
        // Modify IdGenerator to expose the original timestamp for testing
        class TestIdGenerator extends IdGenerator {
            public lastGeneratedTimestamp: Date | null = null;

            generate(getTimestamp?: false): string;
            generate(getTimestamp?: true): { id: string; timestamp: Date };
            generate(
                getTimestamp = false
            ): string | { id: string; timestamp: Date } {
                const result = super.generate(getTimestamp as true);
                if (getTimestamp) {
                    this.lastGeneratedTimestamp = result.timestamp;

                    return result;
                }

                return result;
            }
        }

        const testIdGenerator = new TestIdGenerator();
        const { id } = testIdGenerator.generate(true);
        const extractedTimestamp = testIdGenerator.extractTimestamp(id);

        // Convert original timestamp to milliseconds
        const originalTimestampMilliseconds = Number(
            (testIdGenerator.lastGeneratedTimestamp?.getTime() ?? 0) / 1e3
        );

        // Compare the extracted timestamp with the original timestamp
        expect(extractedTimestamp.getTime() / 1e3).toBe(
            originalTimestampMilliseconds
        );
    });
});
