# PersistentMap

An ES6 Map with Redis-inspired persistence and durability.

Features:
  * ES6 Map api
  * Performant (100K's writes/second sustained)
  * Append-only, atomic file operations for performance and reliability
  * Configurable, capped file size

Note: This API has not been designed or tested for cases involving large amounts
of data.  If you're pushing MB's of data into your map then you'll be in uncharted
territory.  Please test accordingly and report back here with what you find.

## Quick Start

Install:

```
npm install persistentmap
```

Use:
```
// Create a map (and tell it where to save state on disk)
const pm = new PersistentMap('~/datastore.json');

// Load any previous state
await pm.load();

// Treat it like a Map.  State changes are saved to file automatically.
pm.set('foo', 123);
pm.get('foo'); // -> 123

// Mutation methods (set, delete, clear) may be await'ed to insure persistence
await pm.set('foo', 345);

// 'foo' is now saved to disk.  If/when the process dies, restarting it will
// restore 'foo' when the map is load()'ed, above
```

## API

PersistentMap extends the ES6 Map class and, thus, supports the [full ES6 Map
API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).  Additionally, it provides the following API:

### new PersistentMap(filepath, options)

Create

* `filepath` - Location at which to write append-only file
* `options.maxFileSize` - File size (in bytes) at which to auto-compact. Default = 1,000,000.

### async load()

Load map from disk.  This also compacts the append-only file.

### async flush()

Wait for all pending writes to complete before resolving.
