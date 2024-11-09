export function getHighPrecisionTimestamp(): bigint {
    const [seconds, nanoseconds] = process.hrtime();
    const microseconds =
        BigInt(seconds) * BigInt(1e6) + BigInt(nanoseconds) / BigInt(1e3);
    return microseconds;
}
