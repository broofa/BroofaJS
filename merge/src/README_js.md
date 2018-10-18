```javascript --hide
runmd.onRequire = path => path.replace(/^@broofa\/\w+/, '..');
```

# merge

Merge immutable JSON data structures to allow for identity (===) comparisons on
deeply-equal subtrees.

## Installation

```
npm i @broofa/merge
```

## Example

```javascript --run
const assert = require('assert');
const merge = require('@broofa/merge');

const obj0 = {
  a: 'hello',
  b: 123,
  c: {
    ca: 'zig',
    cb: [{a:1}, {b:2}]
  },
};

const obj1 = {
  a: 'world',
  c: {
    ca: {a: 1},
    cb: [{a:99}, {b:2}]
  },
};

const result = merge(obj0, obj1);

// Result will always be deepEqual to right-most argument
assert.deepEqual(obj1, result);

// root.c has changed, so is not identical
result.c === obj0.c; // RESULT

// ... same goes for root.c.ca and root.c.cb and root.c.cb[0]
result.c.ca === obj0.c.ca; // RESULT
result.c.cb === obj0.c.cb; // RESULT
result.c.cb[0] === obj0.c.cb[0]; // RESULT

// 'But root.c.cb[1] hasn't, so `===` works!
result.c.cb[1] === obj0.c.cb[1]; // RESULT
```
