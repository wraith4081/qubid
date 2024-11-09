import crypto from 'crypto';
import { encodeBase62 } from './utils/encoding';
import { generateMachineId } from './utils/machine-id';
import { getHighPrecisionTimestamp } from './utils/timestamp';
import { IdGeneratorOptions } from './types';

const TIMESTAMP_LENGTH = 8; // 8 bytes for high-precision timestamp
const MACHINE_ID_LENGTH = 6; // 6 bytes for machine identifier
const SEQUENCE_LENGTH = 2; // 2 bytes for sequence counter
const RANDOM_LENGTH = 4; // 4 bytes for randomness

const ID_BYTE_LENGTH =
    TIMESTAMP_LENGTH + MACHINE_ID_LENGTH + SEQUENCE_LENGTH + RANDOM_LENGTH;
const TOTAL_BITS = ID_BYTE_LENGTH * 8;

export class IdGenerator {
    private sequenceCounter: number = 0;
    private lastTimestamp: bigint = BigInt(0);
    private machineId: Buffer;

    constructor(options?: IdGeneratorOptions) {
        const useMacAddress = options?.useMacAddress ?? true;
        this.machineId = generateMachineId(useMacAddress);
    }

    generate(): string {
        let timestamp = getHighPrecisionTimestamp();

        // Handle sequence counter and timestamp
        if (timestamp === this.lastTimestamp) {
            this.sequenceCounter++;
            if (this.sequenceCounter > 0xffff) {
                // Wait until the next timestamp
                while (timestamp <= this.lastTimestamp) {
                    timestamp = getHighPrecisionTimestamp();
                }
                this.sequenceCounter = 0;
            }
        } else {
            this.sequenceCounter = 0;
            this.lastTimestamp = timestamp;
        }

        // Convert timestamp to bytes
        const timestampBytes = Buffer.alloc(TIMESTAMP_LENGTH);
        timestampBytes.writeBigUInt64BE(timestamp, 0);

        // Convert sequence counter to bytes
        const sequenceBytes = Buffer.alloc(SEQUENCE_LENGTH);
        sequenceBytes.writeUInt16BE(this.sequenceCounter, 0);

        // Generate random bytes
        const randomBytes = crypto.randomBytes(RANDOM_LENGTH);

        // Concatenate all parts
        const idBuffer = Buffer.concat([
            timestampBytes,
            this.machineId,
            sequenceBytes,
            randomBytes,
        ]);

        // Encode to Base62
        const uniqueId = encodeBase62(idBuffer, TOTAL_BITS);

        return uniqueId;
    }
}
