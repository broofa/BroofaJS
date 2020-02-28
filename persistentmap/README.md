# PersistentMap

An ES6 Map with Redis-inspired persistence and durability

Features:
  * Compatible - Drop-in replacement for ES6 Map
  * Performant - 100K's writes/second sustained
  * Reliable - Append-only transaction file,  atomic file operations
  * Sweet and simple - Zero dependencies, pure JS, < 1KB of code

## Quick Start

Install:

```
npm install persistentmap
```

Use:
```
// Create a map (and tell it where to save state on disk)
const pm = new PersistentMap('~/datastore.json');

// Load any prior state
await pm.load();

// Treat it like a Map
pm.set('foo', 123);
pm.get('foo'); // -> 123

// If you want to verify state has been saved before proceeding
// await the result
await pm.set('foo', 345);

// 'foo' is now saved to disk.  If/when the process dies, restarting it
// will restore 'foo' when the map is load()'ed, above
```

## Performance

PersistentMap works by writing state transactions to an append-only transaction file.  Thus, performance of methods that change the map state (`set()`, `delete()`, and `clear()`), if await'ed, will be noticeably slower.  (Still fast, but "file system fast", not "in process memory" fast).  In most cases, [Big O](https://en.wikipedia.org/wiki/Big_O_notation) performance will be:

* `set(key, val)`: O(N) , where N = `JSON.stringify(val).length`
* `delete(key)`: O(1)
* `clear()`: O(1)

The `set()` and `delete()` operations may occasionally trigger a full-state
rewrite (occurs when filesize > `options.maxFileSize`), in which case
performance will be O(N), where N = `JSON.stringify(map).length`

## API

PersistentMap extends the ES6 Map class.  It provides the full [ES6 Map API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), with the following changes:

* New constructor signature, documented below
* Existing `clear()`, `delete()`, and `set()` methods enhanced to return a
`Promise` that resolves when state has been successfully saved to file (or
    rejects on error).
* New `compact()`, `flush()`, and `load()` methods, documented below

### constructor(filepath, options)

* `filepath` - Location of transaction file. This will be created if it does not
    exist. Note: PersistentMap may occasionally create a temporary file at `${filepath}.tmp`, as well.
* `options.maxFileSize` - Size (bytes) at which to compact the transaction file.
Default = 1,000,000.

### `async` compact()`
Saves current state of map to the transaction file.

### `async` flush()
Wait for all pending writes to complete before resolving.

### `async` load()
Load map state from transaction file.
