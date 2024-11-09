const ENCODING_CHARSET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ENCODING_LENGTH = BigInt(ENCODING_CHARSET.length);
const ENCODING_CHARSET_MAP: { [char: string]: number } = {};
for (let i = 0; i < ENCODING_CHARSET.length; i++) {
    ENCODING_CHARSET_MAP[ENCODING_CHARSET[i]] = i;
}

export function encodeBase62(buffer: Buffer, totalBits: number): string {
    let value = BigInt('0x' + buffer.toString('hex'));
    let encoded = '';

    while (value > 0) {
        const mod = value % ENCODING_LENGTH;
        encoded = ENCODING_CHARSET[Number(mod)] + encoded;
        value = value / ENCODING_LENGTH;
    }

    // Calculate expected length based on total bits and encoding base
    const expectedLength = Math.ceil(
        totalBits / Math.log2(Number(ENCODING_LENGTH))
    );
    return encoded.padStart(expectedLength, '0');
}

export function decodeBase62(input: string): bigint {
    let result = BigInt(0);
    const base = BigInt(62);

    for (const char of input) {
        const value = ENCODING_CHARSET_MAP[char];
        if (value === undefined) {
            throw new Error(`Invalid character '${char}' in Base62 string`);
        }
        result = result * base + BigInt(value);
    }

    return result;
}
