<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# merge

Merge immutable model state (or any data structure, really), preserving references to unchanged nodes, such that the `===` operation can be used to determine where state has changed.  (Useful when dealing with immutable data models such as React+Redux, where `===` is used for exactly this purpose.)

Specifically, given

* Two JSON data structures, `before` and `after`
* `state = merge(before, after)`

Then:

* `assert.deepEqual(state, after)` always passes

And for any path, `[X]`, to an Object or Array within `state`:

* `state[X] === before[X]` where `assert.deepEqual(before[X], state[X])` passes
* `state[X] === after[X]` where no part of `after[X]` is equal to `before[X]`
* `state[X] === (new Object/Array)` when some, but not all state w/in `[X]` has changed

## Installation

```
npm i @broofa/merge
```

## Example

```javascript
const assert = require('assert');
const merge = require('@broofa/merge');

const before = {
  a: 'hello',
  b: 123,
  c: {ca: ['zig'], cb: [{a:1}, {b:2}]},
};

const after = {
  a: 'world',
  b: 123,
  c: {ca: ['zig'], cb: [{a:99}, {b:2}]},
};

const state = merge(before, after);

assert.deepEqual(after, state); // Always true

// Where state HAS changed
state === before; // ⇨ false
state.c === before.c; // ⇨ false
state.c.cb === before.c.cb; // ⇨ false
state.c.cb[0] === before.c.cb[0]; // ⇨ false

// Where state HAS NOT changed
state.c.ca === before.c.ca; // ⇨ true
state.c.cb[1] === before.c.cb[1]; // ⇨ true

```

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)