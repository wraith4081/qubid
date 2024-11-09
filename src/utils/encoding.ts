const ENCODING_CHARSET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ENCODING_LENGTH = BigInt(ENCODING_CHARSET.length);

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
