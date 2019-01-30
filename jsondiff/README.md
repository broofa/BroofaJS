<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# @broofa/jsondiff

Pragmatic, intuitive diffing and patching of JSON objects

## Summary of related modules

There are variety of modules available that can diff and patch JSON data
structures.   Here's a quick run down:

| Module | Size | Patch format | Notes |
|---|---|---|---|
| **@broofa/jsondiff** | 0.7K | Overlay | Readable patches |
| deep-diff | 3.5K | RFC9602-like | Most popular module |
| rfc9602 | 2K | RFC9602 | See below |
| fast-json-patch | 4K | RFC9602 | See below |

The main difference between these modules is in the patch object structure. Most
(all?) of the other modules use a structure based on or similar to RFC9602,
  which is composed of a series of operations that describe how to transform the
  target object.  In contrast, the patches in this module act as an "overlay"
  that is copied onto the target object.  There are tradeoffs to this, some
  good, some bad:

1. **Readability** - A structured patch is easier to read because it "looks"
   like the object it's modifying.
2. **Reordering** - Data is not "moved" in a structured patch.  It is simply
   deleted from the old location and inserted at the new location.
2. **Size** - Operation-based patches are more verbose (lots of duplicate keys
   and values), except in the case where values move locations.  This may have a
   significant impact on network bandwidth, especially for uncompressed data
   streams.
3. **Fault tolerance** - Operation-based patches may fail if operations are
   applied out of order or if the target object does not have the expected
   structure.
4. **DROP/KEEP hack** - See comments about `DROP` and `KEEP` values in "Patch
   Objects", below.  This may be off-putting to some readers.

## Installation

`npm install @broofa/jsondiff`

## Usage

```javascript
const jsondiff = require('@broofa/jsondiff');

const before = {a: 'Hello', b: 'you', c: ['big', 'bad'], d: 'beast'};
const after = {a: 'Hi', c: ['big', 'bad', 'bold'], d: 'beast'};

// Create a patch
// Note the use of DROP (-) and KEEP(+) values
const patch = jsondiff.diff(before, after); // ⇨ { a: 'Hi', b: '-', c: [ '+', '+', 'bold' ] }

// Apply it to the original
const patched = jsondiff.patch(before, patch); // ⇨ { a: 'Hi', c: [ 'big', 'bad', 'bold' ], d: 'beast' }

// Get the expected result
assert.deepEqual(after, patched); // Passes!

```

## API

### jsondiff.DROP & jsondiff.KEEP

const DROP

### jsondiff.diff(before, after)

Creates and returns a "patch object" that describes the differences between
`before` and `after`.  This object is suitable for use in `patch()`.

### jsondiff.patch(before, patch)

Applies a `patch` object to `before` and returns the result.

Note: Any result value that is deep-equal to it's `before` counterpart will
reference the 'before' value directly, allowing `===` to be used as a test
for deep equality.

### jsondiff.merge(before, after)

Shorthand for `jsondiff.patch(before, jsondiff.diff(before, after))`.  Useful
for mutating an object only where values have actually changed.

## Patch Objects

Patch objects are JSON objects with the same structure (schema) as the object
they apply to.  Applying a patch is (almost) as simple as doing a deep copy of
the patch onto the target object.  There are two special cases:

1. `jsondiff.DROP` ("`-`") values are "dropped" (deleted or set
   to `undefined`)
2. `jsondiff.KEEP` ("`+`") values are "kept" (resolve to the corresponding
   value in the target)

Note: `DROP` and `KEEP` are, admittedly, a hack.  If these exact string values
appear in data outside of patch objects, `diff()` and `patch()` may not function
correctly. That said, this is not expected to be an issue in real-world
conditions. (Both strings include a "private use" Unicode character that should
make them fairly unique.)


----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)