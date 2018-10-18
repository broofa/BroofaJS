```javascript --hide
runmd.onRequire = path => path.replace(/^@broofa\/\w+/, '..');
```

# merge

Merge immutable model state (or any data structure, really), preserving references to unchanged nodes.  This
allows for `===` operation to determine where state has changed.  (Useful when
 dealing with immutable data models such as React+Redux, where `===` is used for
 exactly this purpose.)

In practical terms, where `state = merge(before, after)` the returned `state` object has the following properties:

* `assert.deepEqual(state, after)` will always be true
* `state[X] === before[X]` will be true where `deepEqual(before[X], after[X])`
* `state[X] === after[X]` will be true where `after[X]` replaces all `before[X]` state

## Installation

```
npm i @broofa/merge
```

## Example

```javascript --run
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
state === before; // RESULT
state.c === before.c; // RESULT
state.c.cb === before.c.cb; // RESULT
state.c.cb[0] === before.c.cb[0]; // RESULT

// Where state HAS NOT changed
state.c.ca === before.c.ca; // RESULT
state.c.cb[1] === before.c.cb[1]; // RESULT
```
