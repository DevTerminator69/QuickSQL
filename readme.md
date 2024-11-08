# QuickSQL

`QuickSQL` is a versatile, hybrid in-memory and persistent key-value database for Node.js, designed to offer fast data access and optional database syncing. Built using SQL with `better-sqlite3`, `QuickSQL` combines the simplicity of a key-value store with the power of SQL-like operations, making it flexible and efficient for various use cases. It supports in-memory caching, JSON serialization for complex data structures, and automatic syncing to persistent storage.

## Features

- **Key-Value Database**: At its core, `QuickSQL` is a key-value database, where each key is mapped to a specific value, which can be a string, number, object, or array.
- **Hybrid Storage**: Leverage in-memory caching for rapid access while keeping a persistent database as a backup.
- **Memory-First Operation**: Optionally use memory as the primary data store with real-time syncing to the persistent database.
- **Basic SQL-Like Operations**: Commands for `set`, `get`, `delete`, and arithmetic (`add`, `sub`, `mul`, `div`).
- **JSON Storage**: Supports objects, arrays, numbers, and strings, storing values as JSON.
- **Automatic Syncing**: Syncs in-memory data with persistent storage automatically.
- **Error Handling**: Validates inputs and reports errors for invalid operations.
- **Performance Benchmarking**: Measure the speed of database operations (read, write, delete).

## Installation

Install `QuickSQL` using npm:

```bash
npm install QuickSQL
```

## Getting Started

```javascript
const { QuickSQL } = require('QuickSQL');

const db = new QuickSQL({
  filepath: './myDatabase.db',     // Path to the SQLite database file
  holdDataInMemory: true           // Enables memory as primary storage
});
```

### Memory-First Mode

With `holdDataInMemory` set to `true`, `QuickSQL` loads all data into memory on startup and uses the memory cache as the primary data source. Every change to the data is immediately reflected in memory, and optionally, synced back to the persistent database to ensure long-term data storage.

- **On Startup**: Loads all data from the persistent database into memory.
- **In Operation**: Memory cache acts as the primary database for fast data retrieval and manipulation.
- **Automatic Syncing**: Writes changes to the persistent database in the background, maintaining sync with memory.

## Filepath Mode

`QuickSQL` allows you to configure the database to use a persistent SQLite file for long-term data storage. This mode is ideal when you want to store data permanently on disk, while still taking advantage of the fast in-memory cache for quick access.

### Enabling Filepath Mode

To enable **filepath mode**, specify the `filepath` option when initializing the `QuickSQL` database. This file will store your data persistently, while the database can still leverage memory for fast access and manipulation.

```javascript
const db = new QuickSQL({
  filepath: './myDatabase.db',  // Path to SQLite file
  holdDataInMemory: false       // Disables memory-first mode, using persistent database
});
```

- **`filepath`**: The path to the SQLite file where data is stored. This file acts as persistent storage.
- **`holdDataInMemory`**: Set to `false` to disable memory-first mode and use the database file for storage.

### How Filepath Mode Works

In **filepath mode**, the persistent SQLite file is used as the primary storage for all data operations. Any changes made to the data (such as setting, deleting, or updating values) will be written to this database file.

- **On Startup**: The data from the SQLite file is loaded into memory if `holdDataInMemory` is set to `true`. If not, it remains in the file.
- **In Operation**: Data manipulation commands (like `set`, `get`, `delete`) directly affect the SQLite database.
- **Automatic Syncing**: In-memory operations are synced to the persistent database in the background.

### Example

```javascript
// Initialize with a filepath and memory disabled
const db = new QuickSQL({
  filepath: './myDatabase.db',
  holdDataInMemory: false
});

// Storing data in persistent database
db.set("user", { name: "John", age: 30 });

// Retrieve the data (from the database file)
console.log(db.get("user")); // Output: { name: 'John', age: 30 }
```

### Advantages of Filepath Mode

- **Persistent Storage**: Data is written to disk and survives application restarts.
- **Hybrid Flexibility**: Memory can still be leveraged for faster access if `holdDataInMemory` is set to `true`.
- **Reduced Memory Consumption**: Large datasets can remain on disk without consuming a lot of RAM.

## Basic Commands

### Set a Value

Store a value in memory, with optional sync to the database.

```javascript
// Store a value
db.set("user", { name: "John", age: 30 });

// Update or replace an existing value
db.set("user", { name: "John", age: 31 });
```

### Get a Value

Retrieve a value by its key. Uses the memory cache if `holdDataInMemory` is enabled.

```javascript
console.log(db.get("user")); // Output: { name: 'John', age: 31 }
```

### Delete a Value

Remove a specific key from memory, and sync the deletion to the database.

```javascript
db.delete("user");
console.log(db.get("user")); // Output: null
```

## Arithmetic Commands

Perform arithmetic on numeric values stored in memory (or in the database if `holdDataInMemory` is disabled).

### Add

Add a number to a stored value.

```javascript
db.set("counter", 5);
db.add("counter", 3);
console.log(db.get("counter")); // Output: 8
```

### Subtract

Subtract a number from a stored value.

```javascript
db.sub("counter", 2);
console.log(db.get("counter")); // Output: 6
```

### Multiply

Multiply the stored value by a number.

```javascript
db.mul("counter", 4);
console.log(db.get("counter")); // Output: 24
```

### Divide

Divide the stored value by a number.

```javascript
db.div("counter", 3);
console.log(db.get("counter")); // Output: 8
```

> **Note**: Dividing by zero will throw an error.

## Synchronizing Memory and Persistent Storage

When `holdDataInMemory` is enabled, `QuickSQL` stores data in memory and syncs changes to the persistent database to ensure data consistency.

1. **On Startup**: All existing data from the database is loaded into memory.
2. **In Operation**: Memory serves as the primary data source, providing fast data access.
3. **Automatic Sync**: Changes in memory are written back to the database for long-term storage.
4. **Batch Updates** (Optional): Periodic batch updates can be used to reduce write frequency and improve performance.

## Performance Ping Command

The `ping` command benchmarks the read, write, and delete operations for both memory and persistent databases. This helps you assess the performance of each operation and the hybrid caching mechanism.

```javascript
// Run the performance ping to benchmark the database
const result = db.ping();

// Output the results
console.log(`Write Duration: ${result.writeDuration.toFixed(3)} ms`);
console.log(`Read Duration: ${result.readDuration.toFixed(3)} ms`);
console.log(`Delete Duration: ${result.deleteDuration.toFixed(3)} ms`);
```

### Example Output

```bash
Write Duration: 1.235 ms
Read Duration: 0.456 ms
Delete Duration: 0.678 ms
```

## Error Handling

`QuickSQL` includes error handling for invalid operations and input validation:

- **Invalid Key Type**: Only string keys are allowed.
- **Non-Numeric Operations**: Performing arithmetic on non-numeric values will throw an error.
- **Divide by Zero**: Throws an error when attempting to divide by zero.

```javascript
try {
  db.set(123, "value"); // Error: The 'key' must be a string.
} catch (error) {
  console.error(error.message);
}

try {
  db.div("unknown_key", 5); // Error: Key not found or value is not numeric.
} catch (error) {
  console.error(error.message);
}
```

## License

`QuickSQL` is licensed under the MIT License.

---

### Summary of Changes:
- **Key-Value Store**: Emphasized that `QuickSQL` is a key-value database using SQL for operations.
- **Ping Command**: Benchmarks read, write, and delete durations for both in-memory and persistent databases.
- **Memory-First Mode**: Uses memory as the primary database, syncing changes to persistent storage.
- **Filepath Mode**: Enables persistent storage via an SQLite file.
- **Error Handling**: Handles invalid key types, non-numeric operations, and divide-by-zero errors.
- **Basic Commands**: Supports `set`, `get`, `delete`, and arithmetic commands like `add`, `sub`, `mul`, `div`.

This README now highlights `QuickSQL` as a key-value database while maintaining its SQL-like capabilities, along with all the features you’ve requested!
