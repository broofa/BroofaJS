# asyncProxy

A simple, intuitive solution for converting node-style APIs to Promises.

This module is similar to utilities such as `bluebird.promisifyAll` and
`promiseproxy`. The main difference is that it's behavior is driven by calling
code rather than magical introspection or cumbersome configuration options.

Key features ...

* **Tiny**. No dependencies, ~0.3KB when minified/compressed.
* **Zero API footprint**.  Does not change or touch the original API.
* **Drop-in replacement**.  asyncProxy objects look like/feel like/interact with the original API.
* **Simple promisification logic**. Just add "Async".  `api.fooAsync()` ==
`api.foo()`-promisified.
* **Simple multi-args logic**.  Promise resolves to the callback result (for 0-1 result argument) or an Array of results (for 2+ arguments)

## Installation

```
npm i @broofa/asyncproxy
```

## Example: Basic usage

```javascript
const asyncProxy = require('@broofa/asyncproxy');

// Get asyncProxy wrapper for the API
const fs = asyncProxy(require('fs'));

// Add 'Async' to the method name to call the promisified version
fs.readFileAsync('README.md', 'utf8')  // (Note `Async` suffix on method name)
  .then(data => console.log(data));

// ... or async/await-style
const data = await fs.readFileAsync('README.md');
console.log(data);
```

## Example: Multi-arg callbacks

In cases where an API passes 2+ arguments to a callback, the Promise will
resolve to an Array containing the arguments.

```
const asyncProxy = require('@broofa/asyncproxy');

// Get promisified method (with some ES6 object-comprehension sugar for good measure)
const {execAsync} = asyncProxy(require('child_process'));

// Promise#then()-style, using Array comprehension to assign args
execAsync('ls')
  .then(function([stdout, stderr]) {...});

// ... or async/await-style
let [stdout, stderr] = await execAsync('ls');
```

## Example: Custom name pattern

Appending `Async` to method names is a de-facto standard (e.g. bluebird does this),
however this may not always be desirable.  If you'd prefer a different naming
scheme, you may supply a custom regex for detecting promisified methods.  E.g.
To use a prefix of "a\_", you might do the following:

```
const fs = asyncProxy(require('fs'), {methodRegex: /^a_/});

fs.a_readFile('README.md', 'utf8')
  .then(data => console.log(data));
```
