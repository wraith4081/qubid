import crypto from 'crypto';
import os from 'os';

const MACHINE_ID_LENGTH = 6; // 6 bytes for machine identifier

export function generateMachineId(useMacAddress: boolean = true): Buffer {
    if (!useMacAddress) {
        return crypto.randomBytes(MACHINE_ID_LENGTH);
    }

    const interfaces = os.networkInterfaces();
    let macAddress = '';

    // Get the MAC address of the first non-internal interface
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (!iface.internal && iface.mac !== '00:00:00:00:00:00') {
                macAddress = iface.mac;
                break;
            }
        }
        if (macAddress) break;
    }

    // If no MAC address is found, use random bytes
    if (!macAddress) {
        return crypto.randomBytes(MACHINE_ID_LENGTH);
    }

    // Hash the MAC address and process ID to generate a unique machine ID
    const pid = process.pid.toString();
    const hash = crypto.createHash('sha256');
    hash.update(macAddress + pid);
    return hash.digest().slice(0, MACHINE_ID_LENGTH); // 6 bytes
}
