# @broofa/fnv1a

Lite, performant, robust FNV-1a (32-bit) for string hashing

Similar to [the fnv1a module](https://github.com/sindresorhus/fnv1a),
but with the following improvements:

* Handles unicode strings properly and efficiently
* API for creating a digest that can be incrementally updated

## Installation

```
npm i @broofa/fnv1a
```

## Example: One-time hashes

```javascript
const fnv1a = require('@broofa/fnv1a');

fnv1a('hello world'); // => 2166136261
```

## Example: Incremental hashes

```javascript
const fnv1a = require('@broofa/fnv1a');

const digest = fnv1a.digest();
digest.update('hello');
digest.hash;   // => 1335831723
digest.update(' world');
digest.hash;  // => 2166136261

// Or, more concisely
fnv1a.digest()
  .update('hello');
  .update(' world');
  .hash;  // => 2166136261

```
