<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# merge

Merge immutable JSON data structures to allow for identity (===) comparisons on
deeply-equal subtrees.

## Installation

```
npm i @broofa/merge
```

## Example

```javascript
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
result.c === obj0.c; // ⇨ false

// ... same goes for root.c.ca and root.c.cb and root.c.cb[0]
result.c.ca === obj0.c.ca; // ⇨ false
result.c.cb === obj0.c.cb; // ⇨ false
result.c.cb[0] === obj0.c.cb[0]; // ⇨ false

// 'But root.c.cb[1] hasn't, so `===` works!
result.c.cb[1] === obj0.c.cb[1]; // ⇨ true

```

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)