const initTimeMs = Date.now(); // milliseconds since Unix epoch
const initHrtime = process.hrtime.bigint(); // nanoseconds since arbitrary time

export function getHighPrecisionTimestamp(): bigint {
    const hrtimeNow = process.hrtime.bigint(); // nanoseconds
    const elapsedNanoseconds = hrtimeNow - initHrtime; // nanoseconds elapsed since init
    const elapsedMicroseconds = elapsedNanoseconds / BigInt(1e3); // convert to microseconds
    const timestampMicroseconds =
        BigInt(initTimeMs) * BigInt(1e3) + elapsedMicroseconds;
    return timestampMicroseconds;
}
