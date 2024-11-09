# QubID - Quantum-Inspired Unique ID Generator

QubID is a TypeScript library that generates globally unique, k-sorted identifiers inspired by quantum mechanics. It ensures high collision resistance and is horizontally scalable across distributed systems without the need for coordination.

## Features

-   **Globally Unique IDs**
-   **Time-Ordered (K-Sorted)**
-   **High Collision Resistance**
-   **Horizontally Scalable**
-   **Quantum-Inspired Design**

## Installation

```bash
npm install qubid
```

## Usage

```typescript
import { IdGenerator } from 'qubid';

// Create an instance of IdGenerator
const idGenerator = new IdGenerator();

// Generate a unique ID
const id = idGenerator.generate();
console.log('Generated ID:', id);
```

## Options

You can customize the ID generator by passing options:

```typescript
const idGenerator = new IdGenerator({
    useMacAddress: false, // Use random bytes instead of MAC address
});
```

-   **`useMacAddress`** (`boolean`): Whether to use the MAC address and process ID to generate the machine identifier. Defaults to `true`.

## Testing

You can test the uniqueness and sorting properties:

```typescript
const idGenerator = new IdGenerator();
const ids: string[] = [];

for (let i = 0; i < 1000; i++) {
    ids.push(idGenerator.generate());
}

// Check for uniqueness
const uniqueIds = new Set(ids);
console.log('Unique IDs:', uniqueIds.size);

// Verify sorting
const sortedIds = [...ids].sort();
const isSorted = ids.every((id, index) => id === sortedIds[index]);
console.log('IDs are sorted correctly:', isSorted);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
