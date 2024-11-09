import { generateMachineId } from '../../src/utils/machine-id';

describe('generateMachineId', () => {
	test('should generate a buffer of correct length', () => {
		const machineId = generateMachineId();
		expect(machineId).toBeInstanceOf(Buffer);
		expect(machineId.length).toBe(6);
	});

	test('should generate different machine IDs when MAC address is disabled', () => {
		const machineId1 = generateMachineId(false);
		const machineId2 = generateMachineId(false);
		expect(machineId1.equals(machineId2)).toBe(false);
	});
});
