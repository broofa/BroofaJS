# @broofa/fnv1a

Drop-in replacment for the fnv1a module, with support for unicode and incremental hashing.

See [fnv1a module](https://github.com/sindresorhus/fnv1a) for details

## Installation

```
npm i @broofa/fnv1a
```

## Example: One-time hash

```javascript
const fnv1a = require('@broofa/fnv1a');

fnv1a('hello world'); // => 2166136261
```

## Example: Incremental hash

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
