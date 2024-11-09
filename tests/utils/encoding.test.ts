import { encodeBase62 } from '../../src/utils/encoding';
import crypto from 'crypto';

describe('encodeBase62', () => {
	test('should encode buffer to Base62 string', () => {
		const buffer = Buffer.from([0xff, 0xff, 0xff, 0xff]);
		const encoded = encodeBase62(buffer, buffer.length * 8);
		expect(typeof encoded).toBe('string');
		expect(encoded).not.toHaveLength(0);
	});

	test('should produce consistent encoding', () => {
		const buffer = crypto.randomBytes(16);
		const encoded1 = encodeBase62(buffer, buffer.length * 8);
		const encoded2 = encodeBase62(buffer, buffer.length * 8);
		expect(encoded1).toBe(encoded2);
	});
});
