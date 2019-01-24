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
  that is copied onto the target object.  This has the following tradeoffs:

1. **Readability** - A structured patch is easier to read because it looks
   like the object it's modifying.
2. **Size** - Operation-based patches have a lot of redundant keys and values that, again,
making reading (and debugging) more difficult.  This can also affect network
performance in contexts where data is not compressed (e.g. websockets)
3. **Fault tolerance** - Operation-based patches can fail if operations are applied out of order or if the target object does not have the expected structure.
4. **Wonky hack** - Full disclosure:  This module does require a small(?) hack to handle
   the cases where a value is deleted or an array changes.  This may be
   off-putting to some readers.  See comments about `HACK` and `KEEP`, below

## Installation

`npm install @broofa/jsondiff`

## Usage

```javascript
const jsondiff = require('@broofa/jsondiff');

const before = {a: 'Hello', b: 'you', c: ['dark', 'crazy'], d: 'bastard'};
const after = {a: 'Hello', c: ['dark', 'mysterious'], d: 'world'};

// Create a patch
const patch = jsondiff.diff(before, after); // ⇨ { b: '-', c: [ '+', 'mysterious' ], d: 'world' }

// Apply it to the original
const patched = jsondiff.patch(before, patch); // ⇨ { a: 'Hello', c: [ 'dark', 'mysterious' ], d: 'world' }

// Get the expected result
assert.deepEqual(after, patched); // Passes!

```

## API

### jsondiff.diff(before, after)

Creates and returns a "patch object" that describes the differences between
`before` and `after`.  This object is suitable for use in `patch()`.

### jsondiff.patch(before, patchObject)

Applies `patchObject` to `before` and returns the result.

Note: Any result value that is deep-equal to it's `before` counterpart will
reference simply reference the 'before' value.  Thus, `===` can be used to test
for deep equality.

### jsondiff.merge(before, after)

Shorthand for `patch(before, diff(before, after))`.  Useful for
updating an data structure references only where actual values have changed.

## Patch Objects

Patch objects are JSON objects with the same structure (schema) as the object
they apply to.  Applying a patch is (almost) as simple as doing a deep copy of
the patch onto the target object.  There are two minor caveats:

1. The special `jsondiff.DROP` ("`-`") string is used to indicate deleted
   values
2. A changed array is always fully-specified but, for brevity, unchanged items
   are indicated by the special `jsondiff.KEEP` ("`+`") string

Note: The use of `DROP` and `KEEP` is, admittedly, a hack.  If these
exact string values appear in data outside of patch objects, `diff()` and `patch()` may not function correctly. That said, this is not expected to be an issue in real-world conditions. (Both strings include a "private use" Unicode character that should make them fairly unique.)


----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)